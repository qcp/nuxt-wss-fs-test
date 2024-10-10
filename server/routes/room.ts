import type { Peer, Message, WSError } from 'crossws'
import { parse, object, string, optional } from 'valibot';
import manager from '../utils/manager';

function getRoomId(urlRaw?: string) {
  const url = new URL(urlRaw ?? '')
  const id = url.searchParams.get('id')
  if (!id) {
    // TODO some additional store checks
    throw new Error('Broken id')
  }
  return id
}
const parseMessage = (data: string) => parse(object({ name: string(), vote: optional(string()) }), JSON.parse(data))
const prepareMessage = (message: Record<string, unknown>) => JSON.stringify(message)

export default defineWebSocketHandler({
  open: async (peer: Peer) => {
    console.error(typeof peer)
    console.error(Object.keys(peer.websocket))
    try {
      const roomId = getRoomId(peer.request?.url)
      const room = await manager.init(roomId)

      peer.subscribe(roomId)

      room.enter(peer.id, (state) => {
        peer.send(prepareMessage(state))
      })
    }
    catch (ex) {
      console.error(ex)
      peer.close(4404, ex instanceof Error ? ex.message : String(ex))
    }
  },
  close: async (peer: Peer) => {
    const roomId = getRoomId(peer.request?.url)
    peer.unsubscribe(roomId)

    const room = manager.get(roomId)
    room.leave(peer.id)
  },
  error: async (peer: Peer, error: WSError) => {
    const roomId = getRoomId(peer.request?.url)
    const room = manager.get(roomId)

    room.leave(peer.id)
  },
  message: async (peer: Peer, message: Message) => {
    const rawMessage = message.text()
    if (rawMessage == 'ping') {
      peer.send('pong')
      return
    }

    try {
      const roomId = getRoomId(peer.request?.url)
      const room = manager.get(roomId)
      const user = parseMessage(rawMessage)
      room.sunc({ id: peer.id, ...user })
    } catch (ex) {
      console.error(ex)
      peer.close(4406, ex instanceof Error ? ex.message : String(ex))
    }
  },
})