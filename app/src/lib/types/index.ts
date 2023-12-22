// User type
export interface User {
    _id: string;
    name: string;
    avatar: string;
    lastMessage: string;
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