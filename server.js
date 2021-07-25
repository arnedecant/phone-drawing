const express = require('express')
const app = express()

const port = process.env.PORT || 3080
const io = require('socket.io').listen(app.listen(port))
const fs = require('fs')
const secret = 'puppies'

app.use(express.static(__dirname + '/public'))

var server = io.on('connection', function (socket) {

  // A new client has come online

	socket.on('load', (data) => {
		socket.emit('access', { access: (data.key === secret) ? 'granted' : 'denied' })
  })

  // Client has set data

	socket.on('data-updated', (data) => {
		if (data.key !== secret) return
		server.emit('set-data', { hash: data.hash })
  })

  // Client has moved its brush

	socket.on('brush:move', (data) => {
		server.emit('canvas:move', {
			acceleration: data.acceleration,
			velocity: data.velocity,
			interval: data.interval,
			color: data.color
		})
  })

  // Logging

  socket.on('log', (data) => server.emit('log', { data: data }))

})

console.log('Your app is running on http://localhost:' + port);
