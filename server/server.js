const app = require('express')()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
})

io.on('connection', socket => {
	console.log(`user with id: ${socket.id} connected`)

	socket.on('joinRoom', id => {
		socket.join(id)
		console.log(`User with ID: ${socket.id} joined the room: ${id}`)
	})

	socket.on('send_message', data => {
		socket.to(data.room).emit('recieve_message', data)
	})

	socket.on('disconnect', () => {
		console.log(`user with id: ${socket.id} got disconnected`)
	})
})

server.listen(5000, () => {
	console.log('Server is running on port 5000...')
})
