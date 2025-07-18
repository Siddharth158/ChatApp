import express from 'express'
import { connectDb } from './utils/features.js';
import dotenv from 'dotenv'
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.routes.js';
import chatRoute from './routes/chat.routes.js';
import { v4 as uuid } from 'uuid'
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary'
// import { createUser } from './seeders/user.seeder.js';
// import { createGroupChats, createMessageInChat, createSampleChat } from './seeders/chat.seeder.js';

import { Server } from 'socket.io'
import { createServer } from 'http'
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from './constants/events.js';
import { getSockets } from './lib/helper.js';
import { Message } from './models/message.models.js';
import { corsOption } from './constants/config.js'
import { socketAuthenticator } from './middlewares/auth.js';
const userSocketIDs = new Map();

//dot env configurations
dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 3000
const mongoUri = process.env.MONGODB_URI
connectDb(mongoUri);
// createUser(10);
// createSampleChat(10)
// createGroupChats(10)
// createMessageInChat("66d57c16c27bf14a57941697",10)

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: corsOption,
})

app.use(cors(corsOption))
app.use(express.json());
app.use(cookieParser());

// user routes as the middleware with /user as the prefix in the url
app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);

io.use((socket, next) => {
    cookieParser()(
        socket.request,
        socket.request.res,
        async (err) => {
            await socketAuthenticator(err, socket, next)
        })
})

io.on("connection", (socket) => {

    const user = socket.user
    // console.log(user)
    userSocketIDs.set(user._id.toString(), socket.id)
    // console.log(userSocketIDs);
    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
        const realTimeMessage = {
            content: message,
            _id: uuid(),
            sender: {
                _id: user._id,
                name: user.name
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
        }

        const messageForDb = {
            content: message,
            sender: user._id,
            chat: chatId
        }

        // console.log("emitting", realTimeMessage)

        const memberSocket = getSockets(members);
        io.to(memberSocket).emit(NEW_MESSAGE, {
            chatId,
            message: realTimeMessage
        });
        io.to(memberSocket).emit(NEW_MESSAGE_ALERT, {
            chatId
        })
        await Message.create(messageForDb);
    })
    socket.on("disconnect", () => {
        // console.log("user disconnected")
        userSocketIDs.delete(user._id.toString());
    })
})

app.use(errorMiddleware);
server.listen(port, () => {
    console.log("app is listening on 3000");
})

export { userSocketIDs }