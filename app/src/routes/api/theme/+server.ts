export async function POST({ request, cookies }: {request: Request, cookies: any}): Promise<any>
{
    try
    {
        // Gte the theme from body
        const body = await request.json();

        // Set the profile cookie to the selected user
        cookies.set('theme', body.theme, { path: '/' });

        // Return a 200 response
        return new Response("Theme changed successfully.", {
            status: 200,
        });
    }
    catch (e)
    {
        console.error(e);
        return new Response("Failed to set theme.", { status: 500 });
    }
}
