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
import compatibilitiesRoutes from './routes/compatibilities.js'
import genresRoutes from './routes/genres.js'

// socket server
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { configureSocketIO } from './routes/sockets.js'
import cl from 'picocolors'
import { exec } from 'child_process';

const app = express()
app.use(cors())


const server = http.createServer(app)
const io = new SocketIOServer(server, {
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
})

app.set('port', env.APP_PORT)
app.use(morgan('dev'))
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
app.use('/matches', matchesRoutes)
app.use('/compatibilities', compatibilitiesRoutes)
app.use('/genres', genresRoutes)
app.use('/users', usersRoutes)
app.use('/purchases', purchasesRoutes)
app.use('/messages', messagesRoutes)
app.use('/irises', irisesRoutes)
app.use('/detailsmatches', detailsmatchesRoutes)
app.use('/websockets', websocketsRoutes)
app.use('/couples', couplesRoutes)
app.use('/notifies', notifiesRoutes)


app.get('/', (req, res) => {
  res.send('Servidor backend con socket funcionando!')
})

server.listen(app.get('port'), async () => {
  console.log(cl.bgBlue('Server iniciado en puerto: ' + app.get('port')))
  sequelize.sync({ force: env.DB_SYNC == 'true' ? true : false }).then(() => {
    console.log(cl.bgGreen('Sincronizacion base de datos = ' + env.DB_SYNC))
  }).catch(error => {
    console.log(cl.bgRed('se ha producido un error ', error.message))
    console.log(cl.bgRed(error))
  })
})

//VALIDATE IF SYNC TRUE OR FALSE
if (env.DB_SYNC == 'true') {
  console.log(cl.bgGreen('Base de datos sincronizada'))
  // Ejecutar las migraciones
  exec('npx sequelize-cli db:seed:all', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error ejecutando las migraciones: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error en las migraciones: ${stderr}`);
      return;
    }
    console.log(`Migraciones ejecutadas con éxito: ${stdout}`);
  });
}


export default app
