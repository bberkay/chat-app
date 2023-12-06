import { MongoDB } from '$lib/database/mongodb';
import { searchResults} from "$lib/stores/search";

export async function GET(request: Request): Promise<Response>
{
    const db = new MongoDB();
    const url = new URL(request.url);

    // Find the name parameter
    const search = url.searchParams.get("name");

    // If search isn't null, search for the user
    let users = null;
    if(search != null)
        users = await db.searchDocumentByName('users', search);

    // Set the searchedUsers store to the users found(if users is null, set it to all users)
    users = users != null && users!.length > 0 ? users : await db.getAllDocuments('users');
    searchResults.set(users);

    // Return the searchedUsers store
    return new Response(JSON.stringify(users), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}