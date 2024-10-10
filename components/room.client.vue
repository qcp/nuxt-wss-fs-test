<script setup lang="ts">

const props = defineProps<{
  roomId: string
}>()

const history = ref<string[]>([])
const { status, send, close } = useWebSocket(`${location.protocol.startsWith('https') ? 'wss' : 'ws'}://${location.host}/room?id=${props.roomId}`, {
  autoReconnect: {
    retries: 5,
    delay: 5000
  },
  heartbeat: {
    interval: 5000
  },
  onConnected(ws) {
    console.log('onConnected')
  },
  onDisconnected(ws, event) {
    console.log('onDisconnected', event)
  },
  onError(ws, event) {
    console.log('onError', event)
  },
  onMessage(ws, event) {
    if (event.data == 'pong') {
      return
    }
    getMsg(event.data)
  }
})

const name = ref('')
const vote = ref('')
function sendMsg() {
  send(JSON.stringify({
    name: name.value,
    vote: vote.value
  }))
}
async function getMsg(data: any) {
  console.log('onMessage', data)
  history.value.push(data)
}
</script>

<template>
  <div>
    {{ status }}
  </div>
  <div>
    <UInput v-model="name" />
    <UInput v-model="vote" />
    <UButton @click="sendMsg">Send</UButton>
  </div>
  <ul>
    <li v-for="m in history" :key="m">{{ m }}</li>
  </ul>
</template>
