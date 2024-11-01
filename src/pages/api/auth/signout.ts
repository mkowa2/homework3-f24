import type { APIRoute } from 'astro'

// TODO Finalize this GET function to sign out a registered user
// The function should delete the session cookie and navigate to the signin page
export const GET: APIRoute = async ({ redirect, cookies }) => {
    // Your code here
    cookies.delete('session', {
        path: '/', // Ensure the cookie is deleted from the root path
    })
    return redirect('/signin')
}
