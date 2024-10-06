<script setup lang="ts">

const history = ref<string[]>([])
const { status, send, close } = useWebSocket(`ws://${location.host}/api/websocket`, {
  autoReconnect: true,
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
    console.log('onMessage', event.data)
    history.value.push(event.data)
  },
})

const msg = ref('')
function sendMsg() {
  send(msg.value)
  msg.value = ''
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
