import { Server } from "$lib/classes/Server";
import type { User } from '$lib/types';
import { profileStore, friendsStore } from "$lib/stores";
import { get } from 'svelte/store';

export async function load({ cookies }: {cookies: any}): Promise<{theme: string, users: User[], profile: User}>
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
    let users: User[] = get(friendsStore);
    if(!users || users.length === 0)
    {
        users = await Server.getUsersWithDroid();
        friendsStore.set(users);
    }

    /**
     * Profile
     * Get the profile from the cookies. If the profile is not defined, set it to the first user as default.
     */
    let profile = cookies.get('profile') ? JSON.parse(cookies.get('profile')) : undefined;
    if (!profile)
    {
        if(get(friendsStore).length === 0) throw new Error('No users found for using as default profile.');
        profile = get(friendsStore)[0];
        cookies.set('profile', JSON.stringify(profile), { path: '/' });
    }
    profileStore.set(profile);


    return {
        users: users,
        profile: profile,
        theme: theme
    };
}