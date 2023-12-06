import { MongoDB } from '$lib/database/mongodb';
import type { User } from '$lib/database/types';

export async function load(): Promise<{users: Array<User>}>
{
    // Get all users from the database
    const db = new MongoDB();
    const users = await db.getAllDocuments('users');
    users.map((user: User) => {
        user._id = user._id.toString();
    });

    return {
        users: users
    };
}