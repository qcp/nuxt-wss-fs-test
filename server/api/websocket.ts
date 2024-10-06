export default defineWebSocketHandler({
  open(peer) {
    console.log('open', peer.id)
    peer.subscribe('room-name')
    peer.publish('room-name', 'new user')
  },
  close(peer) {
    console.log('close', peer.id)
  },
  error(peer, error) {
    console.log('error', peer.id, error)
  },
  message(peer, message) {
    console.log('message', peer.id, message)
    peer.publish('room-name', message.text())
  }
})