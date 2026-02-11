const { Server } = require('socket.io')
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const generateResponse = require('../services/ai.service')
const messageModel = require('../models/message.model')

function initSocketServer(httpServer) {

    const io = new Server(httpServer, {})

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        if (!cookies.token) {
            next(new Error("authentication error: no token provided!"))
        }

        try {
            const decode = jwt.verify(cookies.token, process.env.JWT_SECRET)
            const user = await userModel.findById(decode.id)
            socket.user = user;

            next()
        }
        catch (err) {
            console.log(new Error("invalid token"))

        }
    })

    io.on("connection", (socket) => {

        socket.on("Ai-message", async (messagePayLoad) => {

            await messageModel.create({
                chat: messagePayLoad.chats,
                user: socket.user._id,
                content: messagePayLoad.content,
                role: "user"
            })

            const chatHistory = await messageModel.find({
                chat: messagePayLoad.chats
            })

            const response = await generateResponse( chatHistory
                .map(item => ({
                    role: item.role,
                    parts: [{ text: item.content }]
                })));



            await messageModel.create({
                chat: messagePayLoad.chats,
                user: socket.user._id,
                content: response,
                role: "model"
            })

            socket.emit("Ai-response", {
                content: response,
                chat: messagePayLoad.chats
            })
        })
    })
}

module.exports = initSocketServer 