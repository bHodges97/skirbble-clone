const app = require('express')()
const server = require('http').Server(app)
const next = require('next')
const socketio = require('socket.io')

const io = socketio(server);
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandle = nextApp.getRequestHandler()

io.on('connect', socket => {
	socket.join('roomtest');
	socket.to('room1').emit('Player connected');
	socket.emit('now',{
		message: 'message received',
	})
	socket.on('disconnecting', () => {
		const rooms = Object.keys(socket.rooms);
		// the rooms array contains at least the socket ID
  });
});

nextApp.prepare().then(() => {
	app.get('*',(req,res)=>{
		return nextHandle(req,res)
	})
	
	server.listen(3000, (err) => {
		if (err) throw err
		console.log('> Ready on http://localhost:3000')
	})
})


