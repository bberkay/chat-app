import type { User } from "$lib/types";
import { profileStore } from "$lib/stores";

export async function POST({ request, cookies }: {request: Request, cookies: any}): Promise<any>
{
    try
    {
        // Get the body from the request
        const selectedUser: User = await request.json()

        // Set the profile cookie to the selected user
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