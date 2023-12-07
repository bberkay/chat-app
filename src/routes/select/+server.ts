export async function POST({ request, cookies }: {request: Request, cookies: any}): Promise<any>
{
    // Get the body from the request
    const selectedUser = await request.json()

    // Set the profile cookie to the selected user
    cookies.set('profile', JSON.stringify(selectedUser), { path: '/' });

    // Return a 200 response
    return new Response(null, {
        status: 200,
    });
}