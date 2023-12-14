import { Client } from "$lib/classes/Client";

export async function POST({ request }: {request: Request}): Promise<any>
{
    // Get the body from the request
    const data = await request.json()

    // Connect to the server with given credentials and client.
    const client = new Client();
    client.send(data);

    // Return a response
    return new Response(null, {
        status: 200,
    });
}