import * as Colyseus from 'colyseus.js'
import { client } from './socket'

export const room = await client.joinOrCreate('my_room')

room.onMessage('update', (data) => {
	console.log(data)
})
