/**
 * Enum for the type of the message that is sent to the WebSocket server.
 */
export enum MessageType{
    CurrentMessages = "CurrentMessages",
    NewMessage = "NewMessage"
}

/**
 * Enum for the type of the api operations.
 */
export enum ApiOperation{
    GetUsers = "get-users",
    GetUser = "get-user",
    GetLastMessage = "get-last-message",
    SearchUsers = "search-users",
    GetSessionId = "get-session-id",
    CheckSessionId = "check-session-id"
}

/**
 *  Type for the data that is sent in the message
 */
export type Message = {
    _id?: string;
    sessionId: string;
    senderId: string;
    receiverId: string;
    content: string;
    sentDate: Date;
}

/**
 * Type for the data that is sent in the url
 * @example { _id: "1", name: "John", avatar: "https://..." }
 */
export interface User {
    _id: string;
    name: string;
    avatar: string;
    lastMessage?: string;
}
