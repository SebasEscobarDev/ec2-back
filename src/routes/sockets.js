import cl from 'picocolors'
import Websocket from '../ORM/factory/Websocket.js'

export async function configureSocketIO(io) {
  io.on('connection', (socket) => {
    console.log(cl.bgGreen(`⚡: ${socket.id} usuario conectado!`))

    socket.on('myUserId', async (user_id) => {
      //io.emit('pruebaResponse', user_id)
      if (user_id == null) { return }
      console.log(cl.bgGreen('🔥: Socket ID: ' + socket.id))
      try {
        Websocket.createItem({ user_id, socket_id: socket.id })
      } catch (e) {
        console.log(cl.bgRed('🔥: Error en la base de datos'))
      }
    })

    socket.on('disconnected', async () => {
      console.log(cl.bgRed('🔥: Socket ID: ' + socket.id + ' disconnected'))
    })

    io.on('disconnected', async () => {
      console.log(cl.bgRed('🔥: IO A Socket ID: ' + socket.id + ' disconnected'))
    })
  })
}
