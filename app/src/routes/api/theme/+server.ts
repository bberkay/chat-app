export async function POST({ request, cookies }: {request: Request, cookies: any}): Promise<any>
{
    // Get the body from the request
    const newTheme = await request.json();

    // Set the profile cookie to the selected user
    cookies.set('theme', newTheme.theme.toString(), { path: '/' });

    // Return a 200 response
    return new Response(null, {
        status: 200,
    });
}