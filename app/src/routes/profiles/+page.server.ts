import type { User } from '$lib/types';
import { friendsStore } from "$lib/stores";
import { get } from 'svelte/store';

export async function load({ cookies }: {cookies: any}): Promise<{users: Array<User>, profile: User}>
{
    // Get the profile from the cookies.
    const profile: User = JSON.parse(cookies.get("profile"));

    // Return the users
    return {
        users: get(friendsStore),
        profile: profile
    };
}