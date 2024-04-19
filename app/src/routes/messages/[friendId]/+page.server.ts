import { Server } from '$lib/classes/Server';
import type { User } from '$lib/types';
import { droid } from '$lib/classes/Droid';
import { usersStore } from "$lib/stores";
import { get } from 'svelte/store';

export async function load({ params, cookies }: { params: { friendId: string }, cookies: any }): Promise<{profile: User, friend: User}>
{
    // Get the profile from the cookies.
    const profile = JSON.parse(cookies.get("profile"));

    // Get the user id from params then find the user from the classes with that id.
    const friendId: string = params.friendId;
    if(friendId === "droid")
        return {profile: profile, friend: droid}

    // If friend is not droid then find the user from the classes with that id.
    const friend = get(usersStore).find(user => user._id === friendId);
    if(!friend) throw new Error("Friend not found.");

    // Return friend for chatting.
    return {
        profile: profile,
        friend: friend!,
    }
}