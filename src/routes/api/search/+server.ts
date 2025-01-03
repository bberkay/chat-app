import { ChatApiService } from "$lib/classes/ChatApiService";
import type { Friend } from "$lib/types";

export async function GET(request: Request): Promise<Response>
{
    try
    {
        const url = new URL(request.url);

        // Find the name parameter
        const search = url.searchParams.get("name");

        // If there is no user with the given name return all users.
        let foundUsers: Friend[] | undefined;
        if(search != null)
            foundUsers = await ChatApiService.searchUsersByName(search);

        // Return the searchedUsers store
        return new Response(JSON.stringify(foundUsers), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    catch(e)
    {
        console.error(e);
        return new Response("Unexpected error while searching for users.", { status: 500 });
    }

}
