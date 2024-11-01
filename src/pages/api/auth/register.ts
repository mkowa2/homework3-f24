import type { APIRoute } from 'astro'
import { getAuth } from 'firebase-admin/auth'
import { app } from '../../../firebase/server'

// TODO Finalize this POST function to register a new user in the Firebase Authentication service
// A new user can be created with an email and password
// The new user object should have the following properties:
// - email: string
// - password: string
// - name: string
// Verifiy that all three properties are present in the request body, otherwise return a 400 status
// The POST function should redirect user back to the signin page upon successful creation

export const POST: APIRoute = async ({ request, redirect }) => {
    const auth = getAuth(app)
    // Get data and check if all required fields are present here
    const { email, password, name } = await request.json()
    if (!email || !password || !name) {
        return new Response('Missing email, password, or name', { status: 400 })
    }
    try {
        // Create user here
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name,
        })
        console.log('Successfully created new user:', userRecord.uid)
        return redirect('/signin')
    } catch (error) {
        console.log(error)
        return new Response(`Something went wrong`, {
            status: 400,
        })
    }
}
