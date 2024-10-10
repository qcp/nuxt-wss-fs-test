<script setup lang="ts">
import { object, string, parse } from 'valibot'

const route = useRoute()
const id = computed(() => parse(object({ gameId: string() }), route.params).gameId)

</script>

<template>
  <div>
    <Room :room-id="id" />
  </div>

</template>

<style scoped></style>