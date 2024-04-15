import express from "express";
import bodyParser from "body-parser";
import register from "./routes/registerRoutes.js"
import login from "./routes/loginRoutes.js"
import home from "./routes/homeRoutes.js"
import dotenv from "dotenv";
import passport from "passport"
import passportSocketio from "passport.socketio";
import session from "express-session";
import {getLogout} from "./controllers/logoutController.js";
import path, {dirname} from "path";
import {fileURLToPath} from "url";
import http from "http";
import {Server as SocketioServer} from "socket.io";
import cookieParser from "cookie-parser";
import {db} from "./db/mysqlConnect.js";
import MySQLStore from 'express-mysql-session';

// Get the current file's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current file
const __dirname = dirname(__filename);
const app = express();

const server = http.createServer(app);
const io = new SocketioServer(server,  {
    cors: {
        origin: "http://localhost:5000" ,
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true
});

dotenv.config();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
// app.use('/socket.io/socket.io.js', express.static(__dirname + '/node_modules/socket.io/client-dist'));

app.use(session({
    name: 'myCustomSessionName',
    secret: "ajkshdfkjhaskjdhfkjahsdf",
    resave: false,
    saveUninitialized: false,
    // store: sessionStore
}));

const sessionMiddleware = session({
    secret: 'ajkshdfkjhaskjdhfkjahsdf',
    resave: false,
    saveUninitialized: false
});

app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        // Если пользователь аутентифицирован, сохраняем его данные в cookie
        res.cookie('user', JSON.stringify(req.user));
    } else {
        // Если пользователь не аутентифицирован, удаляем cookie с данными пользователя
        res.clearCookie('user');
    }
    next();
});
app.use(passport.initialize());
app.use(passport.session());

app.use("/login", login)
app.use("/register", register);
app.use("/", home);
app.use("/logout", getLogout);

app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../node_modules/socket.io/client-dist/socket.io.js'));
});

const port = process.env.PORT || 3002;
const socketsRoom = {};

server.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

io.use((socket, next) => {
    console.log("11111");
    // console.log(socket.request, "req")
    sessionMiddleware(socket.request, {}, next);
    console.log("222222")
})
io.on("connection", (socket) => {
    console.log("33333")
    // const sid = socket.handshake.cookies['connect.sid'];
    console.log(socket.request.session, "session55555")
    if (socket.request.session.passport && socket.request.session.passport.user) {
        console.log("44444");
        const userId = socket.request.session.passport.user;
        const user = allUsers.find(user => user.id === userId);
        console.log(`User connected555: ${user.username}`);
        socket.join("general");
        socketsRoom[socket.id] = "general";

        socket.on("message", (message) => {
            console.log("5555");
            console.log("Message recieved: ", message);

            const room = socketsRoom[socket.id];
            io.to(room).emit("message", message);

        })

        socket.on("joinRoom", (room) => {
            socket.join(room);
            socketsRoom[socket.id] = room;
            console.log("User joined to room: ", room);
        });

        socket.on("leaveRoom", (room) => {
            socket.leave(room);
            socketsRoom[socket.id] = "general";
            console.log("user left the room: ", room);
        })
    }
    else {
        // console.log(socket.request.session.passport.user)
        console.log('User connected (unauthenticated)');
    }
})
