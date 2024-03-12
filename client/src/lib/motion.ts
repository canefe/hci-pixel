import { writable } from 'svelte/store'

export const motionPermission = writable(false)

export function askMotionPermission() {
	if (typeof DeviceMotionEvent !== 'undefined') {
		// (optional) Do something before API request prompt.
		console.log('DeviceMotionEvent is supported')
		DeviceMotionEvent.requestPermission()
			.then((response) => {
				// (optional) Do something after API prompt dismissed.
				if (response == 'granted') {
					console.log('DeviceMotionEvent is granted')
					motionPermission.set(true)
				}
			})
			.catch(console.error)
	}
}
