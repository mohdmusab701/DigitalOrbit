import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dns from "dns";
import dbConnect from "@/backend/database/mongodb";

interface DiagnosticLog {
  timestamp: string;
  level: "info" | "warn" | "error";
  message: string;
}

/**
 * GET /api/health
 *
 * Health-check endpoint that verifies the MongoDB connection is alive.
 * Performs detailed diagnostics including environment verification,
 * DNS resolution checks, and connection verification.
 */
export async function GET() {
  const logs: DiagnosticLog[] = [];
  const addLog = (level: "info" | "warn" | "error", message: string) => {
    logs.push({ timestamp: new Date().toISOString(), level, message });
  };

  addLog("info", "Starting MongoDB Atlas connectivity diagnostics...");

  // ── 1. Verify MONGODB_URI is loaded ────────────────────────
  const uri = process.env.MONGODB_URI;
  const isLoaded = !!uri;
  addLog(
    isLoaded ? "info" : "error",
    isLoaded
      ? "MONGODB_URI is loaded from environment."
      : "MONGODB_URI is missing from process.env."
  );

  let hostname = "unknown";
  let username = "unknown";
  let maskedUri = "";

  if (uri) {
    maskedUri = uri.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:******@");
    addLog("info", `Connection string: ${maskedUri}`);

    const uriMatch = uri.match(
      /^mongodb(?:\+srv)?:\/\/([^:]+):([^@]+)@([^/\\?#]+)/
    );
    if (uriMatch) {
      username = uriMatch[1];
      hostname = uriMatch[3];
      addLog("info", `Cluster hostname: ${hostname}`);
      addLog("info", `Username: ${username}`);
    }
  }

  // ── 2. Connect FIRST (this triggers DNS fix) ───────────────
  let connectionState = "disconnected";
  let credentialsValid = false;

  try {
    if (!uri) throw new Error("No MONGODB_URI to connect to.");

    addLog("info", "Attempting connection to MongoDB Atlas...");
    await dbConnect();

    const readyState = mongoose.connection.readyState;
    const stateMap: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };
    connectionState = stateMap[readyState] ?? "unknown";
    credentialsValid = readyState === 1;
    addLog("info", `Connection state: ${connectionState}`);
  } catch (e) {
    const err = e as Error;
    addLog("error", `Connection failed: ${err.message}`);
  }

  // ── 3. DNS diagnostics (AFTER ensureDns has run via dbConnect) ──
  const dnsDiagnostics: Record<string, unknown> = {
    servers: [],
    srvResolution: null,
    txtResolution: null,
  };

  if (hostname !== "unknown") {
    try {
      dnsDiagnostics.servers = dns.getServers();
      addLog(
        "info",
        `Active DNS servers: ${JSON.stringify(dnsDiagnostics.servers)}`
      );
    } catch (e) {
      addLog("warn", `Could not read DNS servers: ${(e as Error).message}`);
    }

    // SRV lookup
    const srvDomain = `_mongodb._tcp.${hostname}`;
    try {
      const srvRecords = await dns.promises.resolveSrv(srvDomain);
      dnsDiagnostics.srvResolution = { success: true, records: srvRecords };
      addLog(
        "info",
        `SRV resolution: ${srvRecords.length} endpoints resolved.`
      );
    } catch (e) {
      const err = e as Error;
      dnsDiagnostics.srvResolution = { success: false, error: err.message };
      addLog("error", `SRV lookup failed: ${err.message}`);
    }

    // TXT lookup
    try {
      const txtRecords = await dns.promises.resolveTxt(hostname);
      dnsDiagnostics.txtResolution = { success: true, records: txtRecords };
      addLog("info", `TXT resolution resolved.`);
    } catch (e) {
      const err = e as Error;
      dnsDiagnostics.txtResolution = { success: false, error: err.message };
      addLog("warn", `TXT lookup failed: ${err.message}`);
    }
  }

  // ── 4. Response ────────────────────────────────────────────
  const finalStatus = connectionState === "connected" ? "ok" : "error";

  return NextResponse.json(
    {
      status: finalStatus,
      timestamp: new Date().toISOString(),
      loadedHostname: hostname,
      connectionState,
      env: { isLoaded, maskedUri, username },
      dns: dnsDiagnostics,
      credentialsValid,
      logs,
    },
    { status: finalStatus === "ok" ? 200 : 503 }
  );
}
