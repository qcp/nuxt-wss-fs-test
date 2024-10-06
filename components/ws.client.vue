<script setup lang="ts">

const history = ref<string[]>([])
const { status, send, close } = useWebSocket(`${location.protocol.startsWith('https') ? 'wss' : 'ws'}://${location.host}/api/websocket`, {
  autoReconnect: true,
  heartbeat: {
    interval: 2000,
  },
  onConnected(ws) {
    console.log('onConnected')
  },
  onDisconnected(ws, event) {
    console.log('onDisconnected', event.timeStamp)
  },
  onError(ws, event) {
    console.log('onError', event.timeStamp)
  },
  onMessage(ws, event) {
    getMsg(event.data)
  }
})

const msg = ref('')
function sendMsg() {
  send(msg.value)
  msg.value = ''
}
async function getMsg(data: any) {
  if (data instanceof Blob) {
    return
    // const ff = JSON.parse(await data.text())
    // ff.message == 'pong'
  }
  console.log('onMessage', data)
  history.value.push(data)
}
</script>

<template>
  <div>
    {{ status }}
  </div>
  <div>
    <input v-model="msg" />
    <button @click="sendMsg">Send</button>
  </div>
  <ul>
    <li v-for="m in history" :key="m">{{ m }}</li>
  </ul>
</template>
