import { ChatApiService } from "$lib/classes/ChatApiService";

export async function GET(request: Request): Promise<Response>
{
    try
    {
        const url = new URL(request.url);

        // Find the profile
        const sessionId = url.searchParams.get("sessionId")!;
        const profile = url.searchParams.get("profile")!;

        // Get the last messages of the user
        const lastMessage = await ChatApiService.getLastMessages(sessionId, profile);

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
