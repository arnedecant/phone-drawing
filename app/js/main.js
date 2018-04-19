let isMobile = false;
let config = {
	key: null,
	device: {
		type: null
	}
}
let key = '';
const socket = io();

window.onload = function() {
	initLogin();

	socket.on('log', (data) => {
		console.log(data.log);
	});
}

function initLogin() {
	const modalContainer = document.querySelector('section.modal-container'),
		modals = document.querySelectorAll('section.modal-container article.modal'),
		modalButtons = document.querySelectorAll('section.modal-container article.modal form.device-form button');

	modalContainer.classList.add('toggled');
	modals[0].classList.add('toggled');
	document.querySelector('form.login-form').addEventListener('submit', function(e) {
	    e.preventDefault();

	    config.key = document.querySelector('form.login-form input.key').value;

	    if (config.key && config.key.length) {
			socket.emit('load', {
				key: config.key
			});
		}
	});

	socket.on('access', function(data){
		if(data.access === 'granted') {
			modals[0].classList.add('out');
			modals[1].classList.add('toggled');

			for (let i = 0, btn; btn = modalButtons[i]; i++) {
				btn.addEventListener('click', function(e) {
					config.device.type = this.dataset.type;
				    modals[1].classList.remove('toggled', 'in');
					modalContainer.classList.remove('toggled');
					initApp();
				});
			}
		}
	});

	const modalForms = document.querySelectorAll('.modal form');
	for (let i = 0, form; form = modalForms[i]; i++) {
		form.addEventListener('submit', function(e) {
		    e.preventDefault();
		});
	}
}

function initApp() {
	if (config.device.type == 'brush') {
		window.addEventListener('devicemotion', function(e) {
			let acceleration = e.acceleration;

			socket.emit('brush:move', {
				x: e.accelerationIncludingGravity.x.toFixed(5),
				y: e.accelerationIncludingGravity.y.toFixed(5),
				z: e.accelerationIncludingGravity.z.toFixed(5)
			});

			// if (acceleration && acceleration.x && parseFloat(acceleration.x)) {
			// 	let ul = document.querySelector('section.acceleration ul');
			// 	ul.innerHTML = `
			// 		<li><span class="label">x</span><span class="value">${parseFloat(e.acceleration.x).toFixed(5)} m/s2</span></li>
			// 		<li><span class="label">y</span><span class="value">${parseFloat(e.acceleration.y).toFixed(5)} m/s2</span></li>
			// 		<li><span class="label">z</span><span class="value">${parseFloat(e.acceleration.z).toFixed(5)} m/s2</span></li>
			// 	`;
			// }
		});
	} else if (config.device.type == 'canvas') {

	}
}

function save(property, value) {
	if (supportsLocalStorage()) {
		localStorage[property] = value;
	}
}

function supportsLocalStorage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

function parseBoolean(string) {
	if (string == "true" || string == true) {
		return true;
	} else {
		return false;
	}
}

function randomBetween(min,max, floor) {
	var random = Math.random()*(max-min+1)+min;
	if (floor == true) {
		random = Math.floor(random);
	}
    return random;
}

function isEmptyObject(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function getOrientation(e) {
	if (e) {
		orientation = {
			alpha: e.alpha,
			beta: e.beta,
			gamma: e.gamma
		}
	} else {
		return orientation;
	}
}










































	

	 //    let clock = null, 
	 //    	prevClock = new Date().getTime(),
	 //    	motion = {x:0,y:0,z:0},
	 //    	distance = {x:0,y:0,z:0};
		// window.addEventListener("devicemotion", function(e) {
		// 	console.log(e);
		// 	if (e.acceleration.x) {
		// 		clock = new Date().getTime();
		// 		let d = (clock - prevClock) / 1000;
		// 		d *= d;
		// 		motion.x = (e.acceleration.x);
		// 		motion.y = (e.acceleration.y);
		// 		motion.z = (e.acceleration.z);

		// 		distance.x += (motion.x) * d;
		// 		distance.y += (motion.y) * d;
		// 		distance.z += (motion.z) * d;
		// 		prevMotion = motion;
		// 		prevClock = new Date().getTime();
		// 	}

		// 	document.querySelector('section.acceleration ul').innerHTML = `
		// 		<li><span class="label">motion.x</span><span class="value">${motion.x}</span></li>
		// 		<li><span class="label">motion.y</span><span class="value">${motion.y}</span></li>
		// 		<li><span class="label">motion.z</span><span class="value">${motion.z}</span></li>
		// 		<li><span class="label">distance.x</span><span class="value">${distance.x}</span></li>
		// 		<li><span class="label">distance.y</span><span class="value">${distance.y}</span></li>
		// 		<li><span class="label">distance.z</span><span class="value">${distance.z}</span></li>
		// 	`;
		// }, true);