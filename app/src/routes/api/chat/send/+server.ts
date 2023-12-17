import { clientStore } from "$lib/stores";
import { Mongo } from "$lib/classes/Mongo";

export async function POST({ request }: {request: Request}): Promise<any>
{
    // Get the body from the request
    const data = await request.json()

    // Save the message to the database
    // await Mongo.saveMessage(data.senderId, data.receiverId, data.message); // Disabled because of live demo.

    // Connect to the server with given credentials and client.
    clientStore.subscribe((client: any) => {
        client.send(data);
    });

    // Return a response
    return new Response(null, {
        status: 200,
    });
}