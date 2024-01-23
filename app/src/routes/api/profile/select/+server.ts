import type { User } from "$lib/types";
import { profileStore, usersStore } from "$lib/stores";
import { get } from 'svelte/store';

export async function GET({ request, cookies }: {request: Request, cookies: any}): Promise<any>
{
    try
    {
        // Get the id from the URL
        const url = new URL(request.url);
        const id = url.searchParams.get("id");

        // Set the profile cookie to the selected user
        const selectedUser: User | undefined = get(usersStore).find(user => user._id === id);
        if(!selectedUser)
            return new Response("User not found.", { status: 404 });

        cookies.set('profile', JSON.stringify(selectedUser), { path: '/' });
        profileStore.set(selectedUser);

        // Return a 200 response
        return new Response("User selected successfully.", {
            status: 200,
        });
    }
    catch (e)
    {
        console.error(e);
        return new Response("Failed to set profile.", { status: 500 });
    }
}