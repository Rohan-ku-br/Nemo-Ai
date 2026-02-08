const express = require('express')
const cookieParser = require('cookie-parser')

// create routes
const authRoutes = require('./routers/auth.routes')
const chatRoutes = require('./routers/chat.routes')

const app = express()

// use middleware
app.use(express.json())
app.use(cookieParser())


// use routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)

module.exports = app