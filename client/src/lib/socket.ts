import * as Colyseus from 'colyseus.js'
import { PUBLIC_SERVER_URL } from '$env/static/public'

export const client = new Colyseus.Client(`wss://${PUBLIC_SERVER_URL}`)
