import { supabase } from '$lib/supabase'

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const user = await supabase.auth.getUser(cookies.get('sessionid'))
	return {
		data: {
			user: user.data?.user,
			sessionid: cookies.get('sessionid'),
			room: 'lobby'
		}
	}
}
