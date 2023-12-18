import { Mongo } from '$lib/classes/Mongo';

export async function POST({ request, cookies }: {request: Request, cookies: any}): Promise<any>
{
    // Get the body from the request
    const message: { senderId: string, receiverId: string, content: string } = await request.json();

    // Save the message to the database
    // await Mongo.saveMessage(message.senderId, message.receiverId, message.content); // Disabled because of live demo.

    // Return a 200 response
    return new Response(null, {
        status: 200,
    });
}