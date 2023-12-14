import type { User } from '$lib/types';
import { Mongo } from '$lib/classes/Mongo';
import { Global } from '$lib/classes/Global';

export async function load({ params, cookies }: { params: { friendId: string }, cookies: any }): Promise<{userId: string, friend: User, messages: string[]}>
{
    const db = new Mongo();

    // Get the user id from the cookies
    const userId: string = JSON.parse(cookies.get("profile"))._id;

    // Get the user id from params then find the user from the classes with that id.
    const friendId: string = params.friendId;
    if(friendId === "droid")
        return {userId: userId, friend: Global.droid, messages: []}

    // If friend is not droid then find the user from the classes with that id.
    const friend = Global.users.find((user: User) => {
        if (user._id === friendId)
            return user;
    });
    if(!friend) throw new Error("Friend not found.");

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
        friend: friend!,
        messages: messages
    }
}