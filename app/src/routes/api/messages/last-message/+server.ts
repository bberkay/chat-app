import { ChatApiService } from "$lib/classes/ChatApiService";

export async function GET(request: Request): Promise<Response>
{
    try
    {
        const url = new URL(request.url);

        // Find the users
        const sessionId = url.searchParams.get("sessionId")!;
        const user1 = url.searchParams.get("user1")!;
        const user2 = url.searchParams.get("user2")!;

        // Get the last message between the users
        const lastMessage = await ChatApiService.getLastMessageBetweenUsers(sessionId, user1, user2);

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
        return new Response("Unexpected error while getting last message", { status: 500 });
    }

}
