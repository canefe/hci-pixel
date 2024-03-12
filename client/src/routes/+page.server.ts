import { supabase } from '$lib/supabase'
import { client } from '$lib/socket'
import { fail } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	if (!cookies.get('sessionid')) {
		return { success: false }
	}
	const user = await supabase.auth.getUser(cookies.get('sessionid'))
	console.log('Checking user', user.data?.user?.email)
	return user.data
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData()
		const email = data.get('email')
		const password = data.get('password')
		if (!email || !password) {
			return fail(400, { email, password, missing: true })
		}
		const user = await supabase.auth.signInWithPassword({
			email: email?.toString(),
			password: password?.toString()
		})

		if (user.error) {
			return fail(403, { error: user.error?.message })
		}

		cookies.set('sessionid', user?.data?.session?.access_token, {
			path: '/'
		})

		client.auth.token = user?.data?.session?.access_token

		// Save the session token in localStorage

		return { success: true }
	}
}
