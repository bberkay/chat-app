import { MongoDB } from '$lib/database/mongodb';

export async function load(): Promise<{users: Array<{name: string, avatar: string}>}>
{
    // Get all users from the database
    const db = new MongoDB();
    const users = await db.getAllDocuments('users');

    return {
        users: users
    };
}