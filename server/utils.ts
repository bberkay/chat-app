/**
 * Generate a personal channel ID based on the session ID and user ID.
 */
export function generatePersonalChannelId(sessionId: string, userId: string): string {
    return [ sessionId, userId ].sort().join("-");
}

/**
 * Create a simple log message with the current time.
 */
export function createSimpleLog(message: string, sessionId: string | null = "", ...args: any[]): string {
    return `${new Date().toLocaleTimeString()}${sessionId ? `/${sessionId}` : ""} | ${message}${args.length > 0 ? `| ${args.filter(arg => JSON.stringify(arg)).join(" | ")}` : ""}`;
}
