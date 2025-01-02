import { ChatApiService } from '$lib/classes/ChatApiService';
import type { User } from '$lib/types';
import { droid } from '$lib/classes/Droid';

export async function load({ params, cookies }: { params: { friendId: string }, cookies: any }): Promise<{profile: User, friend: User}>
{
    let profile = cookies.get("profile");
    if (profile) profile = JSON.parse(profile);

    const friendId: string = params.friendId;
    if(friendId === "droid")
        return {profile: profile, friend: droid}

    let friends = await ChatApiService.getUsersWithDroid();
    const friend = friends.find(friend => friend._id === friendId);
    if(!friend)
        throw new Error("Friend not found.");

    return {
        profile: profile,
        friend: friend!,
    }
}
