/**
 * A simple logger utility for production monitoring.
 * In a real production scenario, this could easily be swapped out for a Winston, Pino, or Datadog logger.
 * Currently, it standardizes the format of console logs which are captured by Vercel's logging system.
 */

type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

interface LogPayload {
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  timestamp: string;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: string, data?: any): LogPayload {
    return {
      level,
      message,
      context,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  private print(payload: LogPayload) {
    // In production, you might want to send this to a logging service (Datadog, Axiom, etc.)
    // For now, Vercel captures console logs automatically.
    const logString = JSON.stringify(payload);
    
    switch (payload.level) {
      case "INFO":
        console.log(logString);
        break;
      case "WARN":
        console.warn(logString);
        break;
      case "ERROR":
        console.error(logString);
        break;
      case "DEBUG":
        if (process.env.NODE_ENV !== "production") {
          console.debug(logString);
        }
        break;
    }
  }

  info(message: string, context?: string, data?: any) {
    this.print(this.formatMessage("INFO", message, context, data));
  }

  warn(message: string, context?: string, data?: any) {
    this.print(this.formatMessage("WARN", message, context, data));
  }

  error(message: string, context?: string, error?: any) {
    // Extract useful info from Error objects
    const data = error instanceof Error 
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;
      
    this.print(this.formatMessage("ERROR", message, context, data));
  }

  debug(message: string, context?: string, data?: any) {
    this.print(this.formatMessage("DEBUG", message, context, data));
  }
}

export const logger = new Logger();
