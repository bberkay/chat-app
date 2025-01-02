// User type
export interface User {
    _id: string;
    name: string;
    avatar: string;
}

export interface Friend extends User {
    lastMessage?: {
        senderId: string;
        sentAt: Date;
        content: string;
    }
}

// Message type
export interface Message {
    senderId: string;
    receiverId: string;
    content: string;
    sentAt: Date;
}

// Droid type
export interface Droid extends Friend{
    readyMessages: string[];
}

// MessageType that is used in the WebSocket
export enum MessageType{
    AllRoomMessages = "AllRoomMessages",
    NewRoomMessage = "NewRoomMessage",
    NewExternalMessage = "NewExternalMessage",
    LastMessagesFromFriends = "LastMessagesFromFriends"
}
