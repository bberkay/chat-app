// User type
export interface User {
    _id: string;
    name: string;
    avatar: string;
}

// Droid type
export interface Droid extends User{
    readyMessages: string[];
}

// Message type
export interface Message {
    senderId: string;
    receiverId: string;
    content: string;
}

// MessageType that is used in the WebSocket
export enum MessageType {
    CurrentMessages= "CurrentMessages",
    LastMessage = "LastMessage",
    NewMessage = "NewMessage"
}