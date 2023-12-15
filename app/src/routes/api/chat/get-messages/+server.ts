import { Client } from "$lib/classes/Client";

export async function GET({ request }: {request: Request}): Promise<any>
{
    // Connect to the server with given credentials and client.
    const client = new Client();

    // Listen for messages from the server.
    client.listen((message: any) => {
        return new Response(message);
    });
}