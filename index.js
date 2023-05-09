const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const port = 3001

app.get('/', (req, res) => {
  res.send('hello world')
})

io.on('connection', socket => {
  console.log('someone connected')
  socket.on('join-room', ({ userName, roomId }) => {
    console.log('user connected')
    console.log(roomId)
    console.log(userName)
  })
})

server.listen(port, () => {
  console.log(`The Other Side API listening on localhost:${port}`)
})