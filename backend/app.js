const express = require('express');
const app = express();
require('@babel/register');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

//импорт вспомогательных ф-й
const dbCheck = require('./db/dbCheck');

// импорт роутов
const apiRegistrationRoutes = require('./routes/apiRegistrationRoutes')
const apiLoginRoutes = require('./routes/apiLoginRoutes')
const apiLogoutRoutes = require('./routes/apiLogoutRoutes')

 // вызов функции проверки соединения с базоый данных
dbCheck();

app.use(express.static(path.resolve('public')));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on("join_room", (data) => {
        socket.join(data)
        console.log(`User with ID ${socket.id} joined room ${data}`)
    });
    socket.on("send_message", (data) => {
        console.log(data)
       socket.to(data.room).emit("receive_message", data)
    });
   socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
   })
});


const sessionConfig = {
    name: 'chatCookie',
  store: new FileStore(),
  secret: process.env.SECRET ?? 'mySecretPass',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 10,
    httpOnly: true,
  },
};

app.use(session(sessionConfig));

//роутеры
app.use('/', apiRegistrationRoutes);
app.use('/', apiLoginRoutes);
app.use('/', apiLogoutRoutes);

const PORT = process.env.PORT || 3100;
server.listen(PORT, (err) => {
  if (err) return console.log('Ошибка запуска сервера.', err.message)
  console.log(`Сервер запущен на http://localhost:${PORT} `);
});
