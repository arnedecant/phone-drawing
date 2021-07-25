// -------------------------------------------------------------------
// :: App
// -------------------------------------------------------------------

import io from 'socket.io-client'
import Engine from './Engine.js'

class App {

	constructor () {

		this.socket = io()
		this.url = new URL(window.location.href)
		this.debug = this.url.searchParams.get('debug') || 0
		this.device = undefined

		// elements

		this.$container = document.getElementById('canvas')
		this.$video = document.getElementById('video')

		this.$tempCanvas = document.createElement('canvas')
		this.ctx = this.$tempCanvas.getContext('2d')

		// create new engine: setup scene, camera & lighting

		// window.ENGINE = new Engine({ container: this.$container, assetsPath: 'assets/', debug: this.debug })

		// properties

		this.state = {}

		this.modals = {
			// privacy: new Modal('privacy')
		}

		this.components = {
			// interface: new Interface('.interface')
		}

		this.shaders = {
			vertex: document.querySelector('[data-shader="vertex"]').textContent,
			fragment: document.querySelector('[data-shader="fragment"]').textContent
		}
		
		this.cache = { }
		this.uniforms = { }

		// events

		document.body.addEventListener('click', this.click.bind(this))
		window.addEventListener('devicemotion', (e) => console.log('devicemotion', e))
		
		// this.modals.privacy.onClose.addListener(this.init.bind(this))

		// setup

		this.setup()

	}

	setup () {

		// if (/Mobi|Android/i.test(navigator.userAgent)) {
		// 	this.initMobile()
		// } else {
		// 	this.init()
		// }

		this.init()
			this.initMobile()

	}

	clear () {

		// ENGINE.clear()
		// ENGINE.scene.background = new THREE.Color(0x222222)

	}

	reset () {

		this.clear()

	}

	initMobile () {

		console.log('> initMobile')

		this.socket.emit('log', 'initMobile')

		// window.addEventListener('devicemotion', (e) => {

		// 	console.log(e)

		// 	// this.socket.emit('log', e)

		// })

	}

	init () {

		console.log('> init')

		this.clear()
		this.render()

		this.socket.on('log', (data) => console.log('log', data))
		this.socket.on('canvas:move', (data) => console.log('canvas:move', data))

	}

	click (e) {
		


	}

	render (timestamp) {

    // render ENGINE

		// ENGINE.render()
		
		// Do stuff
		
		// ...

		// add self to the requestAnimationFrame

		window.requestAnimationFrame(this.render.bind(this))

	}

}

export default new App()

navigator.getUserMedia = ( navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia)
