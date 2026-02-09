require('dotenv').config()
const app = require('./src/app')
const connectdb = require('./src/db/db')
const initSocketServer = require('./src/sockets/socket.server')
const httpServer = require("http").createServer(app)


connectdb()
initSocketServer(httpServer)

httpServer.listen(3000, ()=>{
    console.log('server run on port number 3000');    
})