const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const port = 3001
let users = [];

app.get('/', (req, res) => {
  res.send('hello world')
})

const addUser = (userName, roomId) => {
  users.push({ userName: userName, roomId: roomId })
}

const getRoomUsers = (roomId) => {
  return users.filter(user => user.roomId === roomId)
}

const removeUser = (userName) => {
  users = users.filter(user => user.userName !== userName)
}

io.on('connection', socket => {
  console.log('someone connected')

  socket.on('join-room', ({ userName, roomId }) => {
    console.log(`user ${userName} joined room ${roomId}`)

    socket.join(roomId)
    addUser(userName, roomId)

    io.to(roomId).emit('all-users', getRoomUsers(roomId))

    socket.on('disconnect', () => {
      console.log('user disconnected')

      removeUser(userName)

      io.to(roomId).emit('all-users', getRoomUsers(roomId))
      socket.leave(roomId)
    })
  })
})

server.listen(port, () => {
  console.log(`The Other Side API listening on localhost:${port}`)
})