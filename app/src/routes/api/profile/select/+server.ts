import type { User } from "$lib/types";
import { ChatApiService } from "$lib/classes/ChatApiService";

export async function GET({ request, cookies }: {request: Request, cookies: any}): Promise<any>
{
    try
    {
        // Get the id from the URL
        const url = new URL(request.url);
        const id = url.searchParams.get("id");

        // Set the profile cookie to the selected user
        const friends: User[] = await ChatApiService.getUsers();
        const selectedUser: User | undefined = friends.find((friend: User) => friend._id === id);
        if(!selectedUser)
            return new Response("User not found.", { status: 404 });

        cookies.set('profile', JSON.stringify(selectedUser), { path: '/' });

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
