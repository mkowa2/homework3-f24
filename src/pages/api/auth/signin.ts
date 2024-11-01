import type { APIRoute } from 'astro'
import { app } from '../../../firebase/server'
import { getAuth } from 'firebase-admin/auth'

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
    const auth = getAuth(app)
    /* Get token from request headers */
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1]
    if (!idToken) {
        return new Response('No token found', { status: 401 })
    }

    // TODO Verify that the token is valid using Firebase auth API. If it isn't, return a 401 status
    try {
        //
        const decodedToken = await auth.verifyIdToken(idToken)
        if (!decodedToken) {
            return new Response('Invalid token', { status: 401 })
        }
    } catch (error) {
        //
        console.error('Token verification failed:', error)
        return new Response('Token verification failed', { status: 401 })
    }
    /* Create and set session cookie */
    const fiveDays = 60 * 60 * 24 * 5 * 1000
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: fiveDays,
    })
    cookies.set('session', sessionCookie, {
        path: '/',
        maxAge: fiveDays,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    })
    return redirect('/dashboard')
}
