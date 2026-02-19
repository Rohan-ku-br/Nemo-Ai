const { Server } = require('socket.io')
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const { generateResponse, generateVector } = require('../services/ai.service')
const messageModel = require('../models/message.model')
const { createMemory, queryMemory } = require('../services/vector.service')

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

    // use Socket.io
    io.on("connection", (socket) => {

        socket.on("ai-message", async (messagePayLoad) => {

            // await messageModel.create({
            //     chat: messagePayLoad.chats,
            //     user: socket.user._id,
            //     content: messagePayLoad.content,
            //     role: "user"
            // })


            const vectors = await generateVector(messagePayLoad.content)
            await createMemory({
                vectors,
                messageId: "7384788452285434",
                metadata: {
                    chat: messagePayLoad.chats,
                    user: socket.user._id
                }
            })

            const chatHistory = (await messageModel.find({
                chat: messagePayLoad.chats
            }).sort({ createdAt: -1 }).limit(20).lean()).reverse()

            const response = await generateResponse(chatHistory
                .map(item => {
                    return {
                        role: item.role,
                        parts: [{ text: item.content }]
                    }
                }));



            // await messageModel.create({
            //     chat: messagePayLoad.chats,
            //     user: socket.user._id,
            //     content: response,
            //     role: "model"
            // })

            socket.emit("ai-response", {
                content: response,
                chat: messagePayLoad.chats
            })
        })
    })
}

module.exports = initSocketServer 