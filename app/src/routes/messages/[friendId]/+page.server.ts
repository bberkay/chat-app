import type { User } from '$lib/types';
import { MongoDB } from '$lib/database/mongodb';

export async function load({ params, cookies }: { params: { friendId: string }, cookies: any }): Promise<{userId: string, friend: User, messages: string[]}>
{
    const db = new MongoDB();

    // Get the user id from params then find the user from the database with that id.
    const friendId: string = params.friendId;
    const friend = await db.getUserById(friendId);
    friend.map((user: User) => {
        user._id = user._id.toString();
    });

    // Get the user id from the cookies
    const userId: string = JSON.parse(cookies.get("profile"))._id;

    // Get the messages between the user and the friend.
    const messages = await db.getMessagesBetweenUsers(userId, friendId);
    messages.map((message: any) => {
        message._id = message._id.toString();
        message.senderId = message.senderId.toString();
        message.receiverId = message.receiverId.toString();
        message.sentDate = message.sentDate.toString();
    });

    // Return friend for chatting.
    return {
        userId: userId,
        friend: friend[0],
        messages: messages
    }
}