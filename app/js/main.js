let isMobile = false,
	key = '';
	config = {
		key: null,
		device: {
			type: null
		},
		colors: ['#FFFFFF', '#333333', '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c']
	},
	brush = {
		isDrawing: false,
		color: config.colors[0]
	},
	canvas = {
		isDrawing: false
	};
const socket = io();

window.onload = function() {
	setVWVH();
	initLogin();

	socket.on('log', (data) => {
		console.log(data.log);
	});
}

function initApp() {
	setMain(config.device.type);

	if (config.device.type == 'brush') {
		let ulHTML = '';

		for (let i = 0, c; c = config.colors[i]; i++) {
			ulHTML += `<li><button class="btn btn-color" data-color="${c}" style="background-color: ${c}">${c}</button></li>`;
		}

		document.querySelector('ul.colors').innerHTML = ulHTML;

		[...document.querySelectorAll('button.btn-color')].map((btnColor) => {
			if (getLuminance(btnColor.dataset.color) > 200) {
				btnColor.classList.add('light');
			}

			btnColor.addEventListener('click', (e) => {
				const btnDraw = document.querySelector('button.btn-draw');
				btnDraw.dataset.color = btnColor.dataset.color;
				btnDraw.style.backgroundColor = btnColor.dataset.color;
				brush.color = btnDraw.dataset.color;

				if (getLuminance(btnDraw.dataset.color) > 200) {
					btnDraw.classList.add('light');
				} else {
					btnDraw.classList.remove('light');
				}
			});
		});

		window.addMultiEventListener('mousedown touchstart', (e) => {
			if (e.target.classList.contains('btn-draw')) {
				brush.isDrawing = true;
			}
		});

		window.addMultiEventListener('mouseup touchend', (e) => {
			brush.isDrawing = false;
		});

		window.addEventListener('devicemotion', (e) => {
			let acceleration = e.accelerationIncludingGravity;

			if (!acceleration || !acceleration.x) return;

			if (brush.isDrawing) {
				socket.emit('brush:draw', {
					acceleration: {
						x: acceleration.x.toFixed(5),
						y: acceleration.y.toFixed(5),
						z: acceleration.z.toFixed(5)
					},
					color: brush.color
				});
			} else {
				socket.emit('brush:move', {
					acceleration: {
						x: acceleration.x.toFixed(5),
						y: acceleration.y.toFixed(5),
						z: acceleration.z.toFixed(5)
					}
				})
			}

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

function setMain(type) {
	document.querySelector('body').classList.add('init');
	document.querySelector(`section.main.${type}`).classList.add('active');
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

function getRGB(b){
    var a;
    if(b&&b.constructor==Array&&b.length==3)return b;
    if(a=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b))return[parseInt(a[1]),parseInt(a[2]),parseInt(a[3])];
    if(a=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(b))return[parseFloat(a[1])*2.55,parseFloat(a[2])*2.55,parseFloat(a[3])*2.55];
    if(a=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(b))return[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],
16)];
    if(a=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(b))return[parseInt(a[1]+a[1],16),parseInt(a[2]+a[2],16),parseInt(a[3]+a[3],16)];
    return (typeof (colors) != "undefined")?colors[jQuery.trim(b).toLowerCase()]:null
};

function getLuminance(color) {
    var rgb = getRGB(color);
    if (!rgb) return null;
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function calcVWVH() {
  var vH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var vW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  document.documentElement.style.setProperty('--vh', `${vH / 100}px`);
  document.documentElement.style.setProperty('--vw', `${vW / 100}px`);
}

function setVWVH() {
	calcVWVH();
	window.addEventListener('onorientationchange', calcVWVH, true);
	window.addEventListener('resize', calcVWVH, true);
}

Object.prototype.addMultiEventListener = function(s, fn, options) {
	if (!this.addEventListener || typeof this.addEventListener !== 'function') return;
	if (typeof s !== 'string' || typeof fn !== 'function') return;

	s.split(' ').map(e => this.addEventListener(e, fn, options));
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