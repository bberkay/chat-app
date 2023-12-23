import { Server } from "$lib/classes/Server";
import { searchResultsStore } from "$lib/stores";
import type { User } from "$lib/types";

export async function GET(request: Request): Promise<Response>
{
    try
    {
        const url = new URL(request.url);

        // Find the name parameter
        const search = url.searchParams.get("name");

        // If search isn't null, search for the user
        let users: User[] | undefined;
        if(search != null)
            users = await Server.searchUsersByName(search);

        // Set the searchedUsers store to the users found(if users is null, theme it to all users)
        users = users && users!.length > 0 ? users : await Server.getUsersWithDroid();
        searchResultsStore.set(users);

        // Return the searchedUsers store
        return new Response(JSON.stringify(users), {
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