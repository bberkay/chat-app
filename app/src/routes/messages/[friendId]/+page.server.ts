import { Server } from '$lib/classes/Server';
import type { User } from '$lib/types';
import { droid } from '$lib/classes/Droid';
import { profileStore, messagesStore } from '$lib/stores';
import { get } from 'svelte/store';

export async function load({ params, cookies }: { params: { friendId: string }, cookies: any }): Promise<{profile?: User, friend: User, messages: string[]}>
{
    // Get the user id from params then find the user from the classes with that id.
    const friendId: string = params.friendId;
    if(friendId === "droid")
        return {friend: droid, messages: []}

    // If friend is not droid then find the user from the classes with that id.
    const friend = await Server.getUserById(friendId);
    if(!friend) throw new Error("Friend not found.");

    // Get the profile from the cookies.
    const profile = JSON.parse(cookies.get("profile"));

    // Get messages between users from the database.
    const messages: string[] = await Server.getMessagesBetweenUsers(profile._id, friendId);

    // Return friend for chatting.
    return {
        profile: profile,
        friend: friend!,
        messages: messages
    }
}