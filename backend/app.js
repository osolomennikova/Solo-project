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
const {Server} = require('socket.io');
const {UserChat, History} = require('./db/models');

//импорт вспомогательных ф-й
const dbCheck = require('./db/dbCheck');

// импорт роутов
const apiRegistrationRoutes = require('./routes/apiRegistrationRoutes')
const apiLoginRoutes = require('./routes/apiLoginRoutes')
const apiLogoutRoutes = require('./routes/apiLogoutRoutes')
const apiUsersRoutes = require('./routes/apiUsersRoutes')
const apiChatsRoutes = require('./routes/apiChatsRoutes')

// вызов функции проверки соединения с базоый данных
dbCheck();

app.use(express.static(path.resolve('public')));
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
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
    socket.on("join_contact", async ({chatID}) => {
        const chat = await UserChat.findOne({where: {id: chatID}});
        console.log(chat.dataValues.room_id);
        socket.join(chat.dataValues.room_id);
    });
    socket.on("join_room", (roomName) => {
        console.log(`User with ID ${socket.id} joined room ${roomName}`)
        socket.join(roomName)
    });
    socket.on("send_message", async (data) => {
        const chat = await UserChat.findOne({where: {id: data.chatID}});
        const history = await History.create({room_id: chat.dataValues.room_id, message: data.message, user_id: chat.dataValues.user_id});
        socket.to(chat.dataValues.room_id).emit("receive_message", data)
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
app.use('/', apiUsersRoutes);
app.use('/', apiChatsRoutes);

const PORT = process.env.PORT || 3100;
server.listen(PORT, (err) => {
    if (err) return console.log('Ошибка запуска сервера.', err.message)
    console.log(`Сервер запущен на http://localhost:${PORT} `);
});
