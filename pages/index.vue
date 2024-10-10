<script setup lang="ts">
import { maxLength, minLength, object, pipe, safeParser, string } from 'valibot';


const router = useRouter()

async function createGame() {
  const { id } = await $fetch('/room', {
    method: 'POST',
    body: JSON.stringify(state)
  })
  console.log(id)
  router.push(id)
}

const schema = object({
  name: pipe(string(), minLength(4, 'Min'), maxLength(16, 'Max')),
  voteSystem: string()
})
const state = reactive({
  name: '',
  voteSystem: ''
})

</script>

<template>
  <div>
    <UCard>
      <UForm :schema="safeParser(schema)" :state="state" @submit="createGame" class="space-y-4">
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup label="Vote System" name="voteSystem">
          <USelectMenu v-model="state.voteSystem" :options="['a', 'b']" />
        </UFormGroup>
        <UButton type="submit" label="Create" />
      </UForm>
    </UCard>
  </div>
</template>

<style scoped></style>