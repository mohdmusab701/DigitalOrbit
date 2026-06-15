import mongoose from "mongoose";
import dns from "dns";
import { execSync } from "child_process";

/**
 * MongoDB Atlas connection utility for Next.js.
 *
 * In development, Next.js clears the Node.js module cache on every HMR reload,
 * which would create a new connection each time. We cache the connection promise
 * on `globalThis` so it persists across hot reloads.
 *
 * In production, this simply reuses the module-level promise.
 */

/**
 * Cached connection stored on globalThis to survive HMR in development.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  dnsFixed: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis._mongooseCache ?? {
  conn: null,
  promise: null,
  dnsFixed: false,
};

if (!globalThis._mongooseCache) {
  globalThis._mongooseCache = cached;
}

/**
 * Discovers the real system DNS servers from the OS, since Node's c-ares
 * resolver sometimes reports only 127.0.0.1 on Windows (e.g. behind VPN,
 * WSL, or certain proxy configs), which cannot resolve MongoDB Atlas SRV records.
 *
 * Falls back to public DNS (8.8.8.8, 1.1.1.1) if OS detection fails.
 */
function discoverSystemDns(): string[] {
  try {
    // Windows: parse `ipconfig /all` for "DNS Servers" lines
    const output = execSync("ipconfig /all", {
      encoding: "utf8",
      timeout: 3000,
    });
    const dnsIps: string[] = [];
    const lines = output.split(/\r?\n/);
    let capturingDns = false;
    const ipv4Re = /(?:\d{1,3}\.){3}\d{1,3}/;

    for (const line of lines) {
      if (/DNS Servers/i.test(line)) {
        capturingDns = true;
        const match = line.match(ipv4Re);
        if (match) dnsIps.push(match[0]);
      } else if (capturingDns) {
        const trimmed = line.trim();
        // Continuation lines are indented — could be IPv4 or IPv6
        const match = trimmed.match(/^((?:\d{1,3}\.){3}\d{1,3})$/);
        if (match) {
          dnsIps.push(match[1]);
        } else if (/^[a-f0-9:]+$/i.test(trimmed)) {
          // IPv6 continuation — skip but keep capturing
          continue;
        } else if (trimmed.length > 0) {
          // Non-IP line — stop capturing
          capturingDns = false;
        }
      }
    }

    // Filter out loopback and duplicates
    const valid = [...new Set(dnsIps)].filter(
      (ip) => ip !== "127.0.0.1" && ip !== "::1"
    );
    if (valid.length > 0) return valid;
  } catch {
    // ipconfig failed or timed out — fall through to defaults
  }

  return ["8.8.8.8", "1.1.1.1"];
}

/**
 * Ensures DNS resolvers are set to reachable servers if the system only has
 * loopback (127.0.0.1) configured in Node's c-ares resolver.
 *
 * Runs once per process and caches the result on globalThis.
 */
function ensureDns(): void {
  if (cached.dnsFixed) return;

  try {
    const currentServers = dns.getServers();
    const isLoopbackOnly = currentServers.every(
      (ip) => ip === "127.0.0.1" || ip === "::1" || ip === "localhost"
    );
    if (isLoopbackOnly || currentServers.length === 0) {
      const realServers = discoverSystemDns();
      dns.setServers(realServers);
      console.log(
        `ℹ️  DNS fallback: loopback-only detected → configured ${realServers.join(", ")}`
      );
    }
  } catch (err) {
    console.warn("⚠️  Failed to set DNS fallbacks:", err);
  }

  cached.dnsFixed = true;
}



/**
 * Manually resolves a mongodb+srv:// URI into a standard mongodb:// URI.
 * The MongoDB driver often bypasses Node's dns.setServers() for SRV lookups,
 * causing ECONNREFUSED on firewalled networks. Manually resolving it ensures
 * we can fallback to OS-level resolution if Node's c-ares resolver fails.
 */
async function resolveSrvUri(uri: string): Promise<string> {
  if (!uri.startsWith("mongodb+srv://")) return uri;

  const match = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/\\?#]+)(\/.*)?$/);
  if (!match) return uri;

  const [, user, pass, hostname, rest] = match;
  
  console.log(`[dbConnect] Manually resolving SRV for ${hostname}...`);
  
  let hosts = "";
  let txtOptions = "";

  try {
    const srvRecords = await dns.promises.resolveSrv(`_mongodb._tcp.${hostname}`);
    const txtRecords = await dns.promises.resolveTxt(hostname);
    hosts = srvRecords.map(r => `${r.name}:${r.port}`).join(",");
    txtOptions = txtRecords.flat().join("&");
  } catch (err) {
    console.log(`[dbConnect] Node DNS failed (${(err as Error).message}). Falling back to OS nslookup...`);
    
    // Fallback to OS nslookup for SRV
    try {
      const srvOut = execSync(`nslookup -type=SRV _mongodb._tcp.${hostname} 2>&1`, { encoding: "utf8" });
      const srvMatches = [...srvOut.matchAll(/svr hostname\s*=\s*([^\s]+)/g)];
      const ports = [...srvOut.matchAll(/port\s*=\s*(\d+)/g)];
      
      if (srvMatches.length === 0) throw new Error("No SRV records found via nslookup");
      
      const srvNodes = srvMatches.map((m, i) => `${m[1]}:${ports[i] ? ports[i][1] : 27017}`);
      hosts = srvNodes.join(",");

      // Fallback to OS nslookup for TXT
      const txtOut = execSync(`nslookup -type=TXT ${hostname} 2>&1`, { encoding: "utf8" });
      const txtMatch = txtOut.match(/text\s*=\s*"([^"]+)"/);
      txtOptions = txtMatch ? txtMatch[1] : "";
    } catch (fallbackErr) {
      console.error(`[dbConnect] OS nslookup fallback also failed:`, fallbackErr);
      return uri; // Return original and let driver try (will likely fail)
    }
  }
  
  const basePath = rest || "/";
  const separator = basePath.includes("?") ? "&" : "?";
  
  const finalUri = `mongodb://${user}:${pass}@${hosts}${basePath}${separator}ssl=true&${txtOptions}`;
  console.log(`[dbConnect] SRV resolved. Transformed to standard URI format.`);
  return finalUri;
}

/**
 * Returns a cached Mongoose connection. Safe to call from API routes,
 * Server Actions, middleware, or any server-side code.
 *
 * @example
 * ```ts
 * import dbConnect from '@/backend/database/mongodb';
 *
 * export async function GET() {
 *   await dbConnect();
 *   // ... use your Mongoose models
 * }
 * ```
 */
async function dbConnect(): Promise<typeof mongoose> {
  // 1. Fix DNS before any connection attempt
  ensureDns();

  // 2. Read URI at call-time to ensure .env.local is loaded
  const rawUri = process.env.MONGODB_URI;
  if (!rawUri) {
    throw new Error(
      "Missing MONGODB_URI environment variable. " +
        "Add it to .env.local — see .env.example for the template."
    );
  }

  // 3. Return the existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // 4. If no in-flight connection promise exists, create one
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = (async () => {
      try {
        const resolvedUri = await resolveSrvUri(rawUri);
        console.log("[dbConnect] Connecting to MongoDB Atlas...");
        const m = await mongoose.connect(resolvedUri, opts);
        console.log("✅ Connected to MongoDB Atlas");
        return m;
      } catch (err) {
        throw err;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("[dbConnect] Connection failed:", error);
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
