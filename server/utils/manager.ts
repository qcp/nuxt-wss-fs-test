import { IRoomId, IUser, IUserId } from "./types";

type IRoom = {
  id: IRoomId
  name: string
  voteSystem: string
}
type IRoomExt = IRoom & { users: Array<IUser> }

class Manager {
  store = useStorage<IRoom>('room');
  manager = new Map<IRoomId, Room>()

  private register(room: Room) {
    // Подпишимся на событие, чтобы синхронизировать стор
    room.enter('0', (state) => {
      this.store.setItem(room.id, { id: state.id, name: state.name, voteSystem: state.voteSystem })
    })

    // Зарегистрирум в менеджере
    this.manager.set(room.id, room)

    return room
  }

  async init(roomId: IRoomId) {
    // Проверим что комната уже инициализированна (после создания или первого входа)
    const roomFromManager = this.manager.get(roomId) // не используем this.get т.к. он в случае отсутствия срыгнёт ошибку
    if (roomFromManager)
      return roomFromManager

    // Если комната не инициализированна, провери её наличие в сторе
    const roomFromStore = await this.store.getItem(roomId)
    if (!roomFromStore)
      throw new Error(`Room "${roomId}" doesn't exist`)

    const { id, name, voteSystem } = roomFromStore
    const room = new Room(id, name, voteSystem)

    return this.register(room)
  }

  async create(name: string, voteSystem: string) {
    const id = crypto.randomUUID()
    const room = new Room(id, name, voteSystem)

    return this.register(room)
  }

  get(roomId: IRoomId) {
    const room = this.manager.get(roomId)
    if (!room)
      throw new Error(`Room "${roomId}" doesn't exist`)
    return room
  }
}

class Room {
  id: IRoomId
  name: string
  voteSystem: string
  showResults: boolean = false

  constructor(id: IRoomId, name: string, voteSystem: string) {
    this.id = id
    this.name = name
    this.voteSystem = voteSystem
  }

  private users: Array<IUser> = []

  private listeners: Map<IUserId, (room: IRoomExt) => void> = new Map()
  private emitUpdate() {
    for (const [, fn] of this.listeners)
      fn(this.get())
  }

  get(): IRoomExt {
    return {
      id: this.id,
      name: this.name,
      voteSystem: this.voteSystem,
      users: this.users
    }
  }
  update(room: Pick<IRoomExt, 'name' | 'voteSystem'>) {
    this.name = room.name
    this.voteSystem = room.voteSystem
    this.emitUpdate()
  }
  sunc(user: IUser) {
    if (this.users.find(({ id }) => id == user.id))
      this.users = this.users.map((item) => item.id === user.id ? user : item)
    else
      this.users.push(user)
    this.emitUpdate()
  }
  enter(userId: IUserId, onUpdate: (room: IRoomExt) => void) {
    this.listeners.set(userId, onUpdate)
  }
  leave(userId: IUserId) {
    this.users = this.users.filter((item) => item.id !== userId)
    this.listeners.delete(userId)

    if (this.users.length > 0)
      this.emitUpdate()
  }
}

const manager = new Manager()
export default manager