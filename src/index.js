import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan'
import cors from 'cors'
import { env } from './environment.js'
// conectar db
import { sequelize } from './database/connection.js'
// rutas
import usersRoutes from './routes/users.js'
import purchasesRoutes from './routes/purchases.js'
import messagesRoutes from './routes/messages.js'
import matchesRoutes from './routes/matches.js'
import irisesRoutes from './routes/irises.js'
import detailsmatchesRoutes from './routes/detailsmatches.js'
import websocketsRoutes from './routes/websockets.js'
import couplesRoutes from './routes/couples.js'
import notifiesRoutes from './routes/notifies.js'

// socket server
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { configureSocketIO } from './routes/sockets.js'
import cl from 'picocolors'

const app = express()
const server = http.createServer(app)
console.log(env.CORS_ORIGIN)
const io = new SocketIOServer(server, {
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
})

app.set('port', env.APP_PORT)
app.use(morgan('dev'))
app.use(cors())
// app.use( session({secret: '123456', resave: true, saveUninitialized: true}) );
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// socket
await configureSocketIO(io)
app.set('socketIo', io);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('__dirname', __dirname);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// usar rutas
app.use('/api/users', usersRoutes)
app.use('/api/purchases', purchasesRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/matches', matchesRoutes)
app.use('/api/irises', irisesRoutes)
app.use('/api/detailsmatches', detailsmatchesRoutes)
app.use('/api/websockets', websocketsRoutes)
app.use('/api/couples', couplesRoutes)
app.use('/api/notifies', notifiesRoutes)


app.get('/', (req, res) => {
  res.send('Servidor backend con socket funcionando!')
})

server.listen(app.get('port'), async () => {
  console.log(cl.bgBlue('Server iniciado en puerto: ' + app.get('port')))
  sequelize.sync({ force: false }).then(() => {
    console.log(cl.bgBlue('DB SYNC TRUE/FALSE = resetear datos cada que inicia el api'))
  }).catch(error => {
    console.log(cl.bgRed('se ha producido un error ', error.message))
    console.log(cl.bgRed(error))
  })
})

export default app
