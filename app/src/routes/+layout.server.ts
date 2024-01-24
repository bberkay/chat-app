import {Server} from "$lib/classes/Server";
import type { User } from "$lib/types";
import { get } from "svelte/store";
import { profileStore, sessionIdStore, usersStore } from "$lib/stores";

export async function load({ cookies }: {cookies: any}): Promise<{theme: string, users: User[], sessionId: string, profile: User}>
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
     * Users
     * Get the users from the server.
     */
    let users: User[] = get(usersStore);
    if(!users || users.length === 0)
    {
        users = await Server.getUsersWithDroid();
        usersStore.set(users);
    }

    /**
     * Profile
     * Get the profile from the cookies. If the profile is not defined, set it to the first user as default.
     */
    let profile = cookies.get('profile') ? JSON.parse(cookies.get('profile')) : undefined;
    if (!profile)
    {
        if(get(usersStore).length === 0) throw new Error('No users found for using as default profile.');
        profile = get(usersStore)[0];
        cookies.set('profile', JSON.stringify(profile), { path: '/' });
    }
    profileStore.set(profile);

    /**
     * Session ID
     * Get Session ID of the user, if it is not defined, get a new one from the server.
     */
    let sessionId = cookies.get('sessionId');
    if (!sessionId)
    {
        sessionId = await Server.getSessionId();
        cookies.set('sessionId', sessionId, { path: '/' });
    }
    sessionIdStore.set(sessionId);

    // Return the data
    return {
        users: get(usersStore),
        profile: get(profileStore),
        sessionId: get(sessionIdStore),
        theme: cookies.get('theme')
    };
}