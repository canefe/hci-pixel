import { writable } from 'svelte/store'
import * as Colyseus from 'colyseus.js'
import { client } from './socket'
import { toast } from '@zerodevx/svelte-toast'
import { MapSchema, Schema } from '@colyseus/schema'
import { browser } from '$app/environment'

export type ErrorRoomState = {
	error: any
}

export declare class PlayerState extends Schema {
	name: string
}

export declare class RoomState extends Schema {
	players: MapSchema<PlayerState>
}

const roomStateStore = writable<RoomState | ErrorRoomState | null>(null)

const createRoomStore = () => {
	const { subscribe, set } = writable<Colyseus.Room<RoomState> | null>(null)

	return {
		subscribe,
		async init(data: any) {
			try {
				console.log(data)
				data = data.data
				client.auth.token = data.sessionid
				const room: Colyseus.Room<RoomState> = await client.joinOrCreate(data.room, {
					user: data.user
				})

				room.onMessage('type', (message) => {
					toast.push(message.text)
				})

				room.onLeave(async (code) => {
					toast.push('Reconnecting...')
					console.log(code)
					// Try to rejoin the room
					await this.init(data)
				})

				room.onStateChange((state) => {
					toast.push('State changed')
				})

				// Immediately set the Colyseus room object to allow for operations like send()
				set(room)

				// Handle new state changes
				room.onStateChange((state) => {
					// Update the separate roomStateStore for UI binding
					roomStateStore.set(state)
				})
			} catch (e) {
				console.error('Error joining room:', e)
				// Use the roomStateStore to handle errors as well
				roomStateStore.set({ error: e })
			}
		},
		// Expose roomStateStore's subscribe method for direct component subscriptions
		roomState: roomStateStore.subscribe
	}
}

export const roomStore = createRoomStore()
