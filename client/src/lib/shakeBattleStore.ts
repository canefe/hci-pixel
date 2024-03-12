import { writable, get } from 'svelte/store'
import { roomStore } from '$lib/roomStore'

export interface ShakeBattleState {
	score: number
}

const createShakeBattleStore = () => {
	const { subscribe, set, update } = writable<ShakeBattleState>({
		score: 0
	})

	// Function to send state updates to the server
	const updateState = (state: ShakeBattleState) => {
		const room = get(roomStore) // Use `get` to synchronously get the current value of the roomStore

		// Ensure we have a valid room before attempting to send messages
		if (room && 'send' in room) {
			console.log('Sending state update:', state)
			room.send('updateState', state)
		} else {
			console.error("Can't send state update, room is not connected.")
		}

		// Update local state store
		update((currentState) => ({ ...currentState, ...state }))
	}

	// Optional: Listen to room state changes if needed
	// This example shows how you might listen for updates from the server to the shakeBattle state
	roomStore.subscribe((room) => {
		if (room && 'onStateChange' in room) {
			room.onStateChange((newState) => {
				// Assuming your RoomState has the shakeBattle state you're interested in
				// You need to adjust this part based on your actual room state structure
				// change playerBox.x and playerBox.y to whatever your state is
			})
		}
	})

	return {
		subscribe,
		updateState
	}
}

export const shakeBattleStore = createShakeBattleStore()
