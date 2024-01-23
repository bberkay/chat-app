import type { User } from '$lib/types';
import { usersStore, profileStore, sessionIdStore } from '$lib/stores';
import { get } from 'svelte/store';

export async function load({ cookies }: {cookies: any}): Promise<{theme: string, users: User[], sessionId: string, profile: User}>
{
    return {
        users: get(usersStore),
        profile: get(profileStore),
        sessionId: get(sessionIdStore),
        theme: cookies.get('theme')
    };
}