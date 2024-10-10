import { parse, object, string, optional } from 'valibot';
import manager  from '../utils/manager';

const validator = (data: unknown) => parse(object({ id: optional(string()), name: string(), voteSystem: string() }), data)

export default defineEventHandler(async (event) => {
  const { id, name, voteSystem } = await readValidatedBody(event, validator)

  if (id) {
    const room = await manager.init(id)
    room.update({ name, voteSystem })
    return room.get()
  }
  else {
    const room = await manager.create(name, voteSystem)
    return room.get()
  }
})