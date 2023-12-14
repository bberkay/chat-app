import { Client } from "$lib/classes/Client";

export async function GET({ request }: {request: Request}): Promise<any>
{
    // Get the parameters from the request
    const url = new URL(request.url);

    // Connect to the server with given credentials and client.
    const client = new Client();

}