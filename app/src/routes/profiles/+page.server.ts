import { Server } from "$lib/classes/Server";
import type { User } from '$lib/types';

export async function load({ cookies }: {cookies: any}): Promise<{users: Array<User>, profile: User}>
{
    // Get the users from the server.
    const users: User[] = await Server.getUsers();

    // Get the profile from the cookies.
    const profile: User = JSON.parse(cookies.get("profile"));

    // Return the users
    return {
        users: users,
        profile: profile
    };
}