import { MongoDB } from '$lib/database/mongodb';
import type { User } from '$lib/database/types';

export async function load({ cookies }: {cookies: any}): Promise<{users: Array<User>, selectedUserId: string}>
{
    // Get all users from the database
    const db = new MongoDB();
    const users = await db.getAllDocuments('users');
    users.map((user: User) => {
        user._id = user._id.toString();
    });

    // Find current user from cookie
    const selectedUserId = JSON.parse(cookies.get("profile"))._id;

    return {
        users: users,
        selectedUserId: selectedUserId
    };
}