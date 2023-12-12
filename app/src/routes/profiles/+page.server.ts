import { Global } from "$lib/classes/Global";
import type { User } from '$lib/types';

export async function load({ cookies }: {cookies: any}): Promise<{users: Array<User>, currentUserId: string}>
{
    // Get the selected user id from the cookies
    const currentUserId = JSON.parse(cookies.get("profile"))._id;

    // Return the users
    return {
        users: Global.users,
        currentUserId: currentUserId
    };
}