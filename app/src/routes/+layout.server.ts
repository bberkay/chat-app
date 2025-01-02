import { ChatApiService } from "$lib/classes/ChatApiService";
import type { User, Friend } from "$lib/types";

export async function load({ cookies }: {cookies: any}): Promise<{theme: "dark" | "light", friends: Friend[], sessionId: string, profile: User}>
{
    /**
     * Theme
     * Get the theme from the cookies and set it to dark as default if it is not defined.
     */
    let theme = cookies.get('theme');
    if (!theme){
        theme = 'dark';
        cookies.set('theme', theme, { path: '/' });
    }

    /**
     * Friends
     * Get the friends from the server.
     */
    let friends: Friend[] = await ChatApiService.getUsersWithDroid();

    /**
     * Profile
     * Get the profile from the cookies. If the profile is not defined, set it to the first user as default.
     */
    let profile = cookies.get('profile') ? JSON.parse(cookies.get('profile')) : undefined;
    if (!profile)
    {
        if(friends.length === 0) throw new Error('No users found for using as default profile.');
        profile = friends[0];
        cookies.set('profile', JSON.stringify(profile), { path: '/' });
    }
    friends = friends.filter(friend => friend._id !== profile._id);

    /**
     * Session ID
     * Get Session ID of the user, if it is not defined, get a new one from the server.
     */
    let sessionId = cookies.get('sessionId');
    if (!sessionId)
    {
        sessionId = await ChatApiService.createSessionId();
        cookies.set('sessionId', sessionId, { path: '/' });
    }

    // Return the data
    return {
        friends,
        profile,
        sessionId,
        theme
    };
}
