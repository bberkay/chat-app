/**
 * Type for the data that is sent in the url
 * @example /chat/1/2 -> { senderId: "1", receiverId: "2", roomId: "1-2" }
 */
export type Credentials = {
    senderId: string;
    receiverId: string;
    roomId: string;
}

/**
 *  Type for the data that is sent in the message
 *  @example { senderId: "1", content: "Hello" }
 */
export type Message = {
    senderId: string;
    receiverId: string;
    content: string;
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