import { ChatApiService } from "$lib/classes/ChatApiService";

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
        const isValid = await ChatApiService.checkSessionId(id);
        if (isValid) {
            cookies.set('sessionId', id, { path: '/' });

            // Return the searchedUsers store
            return new Response(JSON.stringify(isValid), { status: 200 });
        }

        return new Response("Session ID not found.", { status: 404 });
    }
    catch(e)
    {
        console.error(e);
        return new Response("Unexpected error while searching for users.", { status: 500 });
    }

}
