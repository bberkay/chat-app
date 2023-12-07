import type { User } from '$lib/database/types';
import { MongoDB } from '$lib/database/mongodb';

export async function load({ params }: { params: { friendId: string } }): Promise<{friend: User}>
{
    const db = new MongoDB();

    // Get the user id from params then find the user from the database with that id.
    const friendId: string = params.friendId;
    const friend = await db.getDocumentById("users", friendId);
    friend.map((user: User) => {
        user._id = user._id.toString();
    });

    // Return friend for chatting.
    return {
        friend: friend[0]
    }
}