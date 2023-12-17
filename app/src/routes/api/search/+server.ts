import { Mongo } from '$lib/classes/Mongo';
import { searchResultsStore } from "$lib/stores";

export async function GET(request: Request): Promise<Response>
{
    const url = new URL(request.url);

    // Find the name parameter
    const search = url.searchParams.get("name");

    // If search isn't null, search for the user
    let users = null;
    if(search != null)
        users = await Mongo.searchUserByName(search);

    // Set the searchedUsers store to the users found(if users is null, theme it to all users)
    users = users != null && users!.length > 0 ? users : await Mongo.getAllUsers();
    searchResultsStore.set(users);

    // Return the searchedUsers store
    return new Response(JSON.stringify(users), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}