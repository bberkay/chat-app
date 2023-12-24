import { Server } from "$lib/classes/Server";

export async function GET(request: Request): Promise<Response>
{
    try
    {
        const url = new URL(request.url);

        // Find the users
        const user1 = url.searchParams.get("user1")!;
        const user2 = url.searchParams.get("user2")!;

        // Get the last message between the users
        const lastMessage = await Server.getLastMessageBetweenUsers(user1, user2);

        // Return the searchedUsers store
        return new Response(lastMessage, {
            headers: {
                'Content-Type': 'application/text'
            }
        });
    }
    catch(e)
    {
        console.error(e);
        return new Response("Unexpected error while searching for users.", { status: 500 });
    }

}