import { Server } from "$lib/classes/Server";
import { sessionIdStore } from "$lib/stores";

export async function GET({ request, cookies }: {request: Request, cookies: any}): Promise<Response>
{
    try
    {
        // Check if the id is valid
        const url = new URL(request.url);
        const id = url.searchParams.get('id')?.trim()?.replace(/"/g, "");
        if(!id || id!.length !== 24)
            return new Response("Invalid user ID.", { status: 400 });

        // Check if the session id is valid on the server.
        const newSessionId = await Server.checkSessionId(id);
        if(newSessionId !== "false"){
            cookies.set('sessionId', newSessionId, { path: '/' });
            sessionIdStore.set(newSessionId);
        }

        // Return the searchedUsers store
        return new Response(newSessionId, { status: 200 });
    }
    catch(e)
    {
        console.error(e);
        return new Response("Unexpected error while searching for users.", { status: 500 });
    }

}