/* Mowe Anchor */

var Anchor = (function() {

	function Anchor(rules, fallback) {

		var self = this;

		this.rules = [];

		this.fallback = fallback || false;

		if (rules) this.getRules(rules);

	}

	Anchor.prototype.getRules = function(rules) {

		for (var i = rules.length; i--; )
			if (rules[i].anchor) {

				var rule = {};

				rule.anchor = rules[i].anchor;
				rule.fallback = rules[i].fallback;

				this.rules.push(rule);

			}

	};

	Anchor.prototype.matchAnchor = function(anchor) {

		return !!window.location.href.match(new RegExp(anchor, 'g'));

	};

	Anchor.prototype.matchAllAnchors = function() {

		for (var i = this.rules.length; i--; )
			if (this.matchAnchor(this.rules[i].anchor)) {
				this.rules[i].fallback();
				return;
			}

		if (this.fallback) this.fallback();

	};

	Anchor.prototype.init = function() {

		if (this.rules.length) this.matchAllAnchors();

	};

	return Anchor;

})();
/*!
 * Mowe Contact v1.0.0 (http://letsmowe.com/)
 * Copyright 2013-2016 Kabana's Info Developers
 * Licensed under MIT (https://github.com/noibe/villa/blob/master/LICENSE)
 */

var Contact = (function() {

	/**
	 * Constructor of Contact
	 * Needs of jQuery Ajax (>1.11.3)
	 * @param viewport
	 * @param options
	 * @constructor menu
	 */
	function Contact(viewport, options) {

		var self = this;

		this.viewport = viewport;

		this.url = !!options.url ? options.url : false;

		this.data = {};

		this.fields = {};

		this.clickCtrl = function() {

			self.initResponse(this);

		};

		this.asyncSuccessCtrl = function(data) {

			console.log(data);

			if (data.sent)
				self.showMessage();
			else
				self.send();

		};

		this.asyncErrorCtrl = function(data) {

			//console.log('erro');
			self.send();

		};

	}

	Contact.prototype.showMessage = function() {

		alert('Sua mensagem foi enviada! Agradecemos o contato! :)');

	};

	Contact.prototype.send = function() {

		// TODO - fallback to init send action
		console.log('enviando');

		$.ajax({
			url: this.url,
			type: 'jsonp',
			cache: false,
			data: this.data,
			method: 'get',
			timeout: 30000,
			success: this.asyncSuccessCtrl,
			error: this.asyncErrorCtrl
		});

	};

	Contact.prototype.initSend = function() {

		this.send();

	};

	Contact.prototype.loadTextFieldValue = function(element) {

		return element ? element.value : false;

	};

	Contact.prototype.loadFieldsData = function(initSend) {

		this.data.name = this.loadTextFieldValue(this.fields.name);
		this.data.mail = this.loadTextFieldValue(this.fields.mail);
		this.data.phone = this.loadTextFieldValue(this.fields.phone);
		this.data.message = this.loadTextFieldValue(this.fields.message);

		if (initSend) this.initSend();

	};

	Contact.prototype.validateTextField = function(element) {

		return element ? element.value != '' : false;

	};

	Contact.prototype.validateOptionalFields = function() {

		return (!!this.validateTextField(this.fields.phone) || !!this.validateTextField(this.fields.mail));

	};

	Contact.prototype.validateFields = function() {

		return !(!this.validateTextField(this.fields.name) || !this.validateTextField(this.fields.message) || !this.validateOptionalFields());

	};

	Contact.prototype.initResponse = function(event) {

		if (this.validateFields())
			this.loadFieldsData(true);
		else {
			// TODO - error function
		}

	};

	Contact.prototype.addListeners = function() {

		addListener(this.submit, 'click','onclick',this.clickCtrl, false);

	};

	Contact.prototype.getFields = function() {

		this.fields.name = document.getElementById('cNome');
		this.fields.mail = document.getElementById('cEmail');
		this.fields.phone = document.getElementById('cPhone');
		this.fields.message = document.getElementById('cMensagem');

		this.submit = document.getElementById('cSubmit');

		this.addListeners();

	};

	Contact.prototype.init = function() {

		this.getFields();

	};

	return Contact;

})();
/**
 @param {object} element
 @param {string} type
 @param {string} crossType
 @param {Function} listener
 @param {boolean} [useCapture]
 */
var addListener = function(element, type, crossType, listener, useCapture) {

	if (window.addEventListener)
		element.addEventListener(type, listener, !!useCapture);
	else element.attachEvent(crossType ? crossType : type, listener);

};

// easing functions http://goo.gl/5HLl8
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) {
		return c/2*t*t + b
	}
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInCubic = function(t, b, c, d) {
	var tc = (t/=d)*t*t;
	return b+c*(tc);
};

Math.inOutQuintic = function(t, b, c, d) {
	var ts = (t/=d)*t,
		tc = ts*t;
	return b+c*(6*tc*ts + -15*ts*ts + 10*tc);
};

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
var requestAnimFrame = (function(){
	return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
})();

function scrollTo(to, callback, duration) {
	// because it's so fucking difficult to detect the scrolling element, just move them all
	function move(amount) {
		document.documentElement.scrollTop = amount;
		document.body.parentNode.scrollTop = amount;
		document.body.scrollTop = amount;
	}
	function position() {
		return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
	}
	var start = position(),
		change = to - start,
		currentTime = 0,
		increment = 20;
	duration = (typeof(duration) === 'undefined') ? 500 : duration;
	var animateScroll = function() {
		// increment the time
		currentTime += increment;
		// find the value with the quadratic in-out easing function
		var val = Math.easeInOutQuad(currentTime, start, change, duration);
		// move the document.body
		move(val);
		// do the animation unless its over
		if (currentTime < duration) {
			requestAnimFrame(animateScroll);
		} else {
			if (callback && typeof(callback) === 'function') {
				// the animation is done so lets callback
				callback();
			}
		}
	};
	animateScroll();
}
/*!
 * Mowe Gallery v1.0.0 (http://letsmowe.org/)
 * Copyright 2013-2015 Noibe Developers
 * Licensed under MIT (https://github.com/noibe/villa/blob/master/LICENSE)
 */

var Gallery = (function () {

	/**
	 * The constructor
	 * @constructor
	 */
	function Gallery() {

		var self = this;

		this.main = document.getElementById('main');
		this.viewport = document.getElementById('hero');
		this.gallery = document.getElementById('hero-gallery');

		this.slides = this.gallery.querySelectorAll('.GalleryContent');

		/**
		 * Get, update and set the current to keep slide
		 */
		this.nextSlide = function () {

			var c, n, i;

			if (c = self.getCurrent(true)) {

				i = ( c.index == self.slides.length - 1 ) ? 0 : c.index + 1;
				n = self.slides[i];
				n.index = i;

				self.setCurrent(self.updateCurrent(n));

			}

			self.translateSlides();
			self.initInfiniteLoop();

		};

		/**
		 * Controller of click and touch events
		 */
		this.ctrlClick = function () {

			if (self.allowClick) self.nextSlide();

		};

		/**
		 * Controller of size of gallery and slides
		 * Also do a nextSlide function after 1200 milliseconds
		 */
		this.ctrlResize = function () {

			setTimeout(function () {
				self.resizeGallery();
				self.resizeSlides();
			}, 400);

			self.initInfiniteLoop(1200);

		};

	}

	/**
	 * Get the current slide
	 * @param {boolean|undefined} remove
	 * @return {object} current
	 */
	Gallery.prototype.getCurrent = function (remove) {

		var c, n;

		for (var i = this.slides.length; i--;)
			if (this.slides[i].classList.contains('current')) {
				if (remove) this.slides[i].classList.remove('current');
				c = this.slides[i];
				c.index = i;
			}

		if (!c) {
			n = this.slides[0];
			n.index = 0;
		}

		return n ? n : c;

	};

	/**
	 * Current Setter
	 * @param {object} current
	 * @return {object} current
	 */
	Gallery.prototype.setCurrent = function (current) {

		this.current = current;

	};

	/**
	 * Current Update Class
	 * @param {object} current
	 * @return {object} current
	 */
	Gallery.prototype.updateCurrent = function (current) {

		current.classList.add('current');
		return current;

	};

	/**
	 * Set the slide translate property (webkit and ie9 support)
	 * @param {object} a element
	 * @param {number} b width
	 */
	Gallery.prototype.setSlideTranslate = function (a, b) {
		a.style.transform = 'translateX(' + b + 'px)';
		a.style.webkitAlignContent = 'translateX(' + b + 'px)';
		a.style.msTransform = 'translateX(' + b + 'px)';
	};

	/**
	 * Do the slide translate
	 */
	Gallery.prototype.translateSlides = function () {

		var self = this;

		var c, w;

		this.allowClick = false;

		c = this.current.index;
		w = this.current.offsetWidth;

		for (var i = this.slides.length; i--;)
			this.setSlideTranslate(this.slides[i], ( i - c ) * w);

		setTimeout(function () {
			self.allowClick = true;
		}, 700);

	};

	/**
	 * Resize the .gallery-content
	 */
	Gallery.prototype.resizeSlides = function () {

		for (var i = this.slides.length; i--;)
			this.slides[i].style.width = this.viewport.offsetWidth + 'px';

	};

	/**
	 * Resize the .gallery
	 */
	Gallery.prototype.resizeGallery = function () {

		var h, w;

		//h = this.viewport.offsetWidth * .7;
		h = this.viewport.offsetHeight;
		w = this.viewport.offsetWidth * this.slides.length;

		if (h > window.innerHeight) h = window.innerHeight;

		this.gallery.style.height = h + 'px';
		this.gallery.style.width = w + 'px';

	};

	/**
	 * Controller the global interval function
	 */
	Gallery.prototype.initInfiniteLoop = function (interval) {

		var self = this;

		if (interval) {

			if (this.infiniteLoop)
				clearInterval(this.infiniteLoop);

			this.infiniteLoop = setTimeout(function() {
				self.nextSlide();
				self.doInfiniteLoop();
			}, interval);

		} else this.doInfiniteLoop();

	};

	/**
	 * Do the infinite loop
	 */
	Gallery.prototype.doInfiniteLoop = function () {

		var self = this;

		if (self.infiniteLoop) clearInterval(self.infiniteLoop);

		self.loopInterval = 5000;
		self.infiniteLoop = setInterval(self.nextSlide, self.loopInterval);

	};

	/**
	 * Init the gallery
	 */
	Gallery.prototype.init = function () {

		var self = this;

		this.current = this.updateCurrent(this.getCurrent(true));

		addListener(this.viewport, 'click', 'onclick', self.ctrlClick, false);

		this.loopInterval = 6000;
		addListener(window, 'resize', false, self.ctrlResize, false);

		this.resizeGallery();
		this.resizeSlides();
		this.translateSlides();

		self.initInfiniteLoop();

	};

	return Gallery;

})();
/*!
 * Mowe is.js v1.0.0 (http://letsmowe.org/)
 * Copyright 2013-2015 Noibe Developers
 * Licensed under MIT (https://github.com/noibe/villa/blob/master/LICENSE)
 */

var is = {
	portrait: function() {
		// plus 1 add preference to portrait mode
		return window.innerHeight + 1 > window.innerWidth;
	},
	mobile: {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
		}
	},
	any: function() {
		return (this.portrait() || this.mobile.any())
	}
};

/**
 * Add or remove the class based on size of screen or the user agent
 */
is.windowResizeCtrl = function() {

	var _ = document.documentElement;
	_.is = _.is || {};

	// ctrl the class portrait and landscape
	// if the var _.is.portrait is true, doesn't need to add the class (+ fast function)
	if (is.portrait()) {
		if (!_.is.portrait) {
			_.classList.add('is-portrait');
			_.classList.remove('is-landscape');
		}
		_.is.portrait = true;
	} else {
		if (_.is.portrait) {
			_.classList.remove('is-portrait');
			_.classList.add('is-landscape');
		}
		_.is.portrait = false;
	}

};

/**
 * Init the is.js listeners and vars
 */
is.init = function() {

	var _ = document.documentElement;
	_.is = _.is || {};

	// ctrl the class mobile
	// if the var _.is.mobile is true, doesn't need to add the class (+ fast function)
	if (is.mobile.any()) {
		if (!_.is.mobile) _.classList.add('is-mobile');
		_.is.mobile = true;
	} else {
		if (!_.is.mobile) _.classList.remove('is-mobile');
		_.is.mobile = false;
	}

	// fall back to add the class
	_.is.portrait = !is.portrait();

	if (window.addEventListener)
		window.addEventListener('resize', is.windowResizeCtrl, false);
	else window.attachEvent('onresize', is.windowResizeCtrl);

	is.windowResizeCtrl();

};

(function(){
	// initialize all the piece of shit
	is.init();
})();
/* Mowe Next.js */

/**
 * The Keep.js keep a keep transition
 */
var Keep = (function() {

	function Keep(trigger, frame, options) {

		var self = this;

		this.trigger = trigger;
		this.frame = frame;
		this.options = options;

		this.animationTimeDelay = this.options.animationTimeDelay || 500;
		this.animationTime = this.options.animationTime || 500;
		this.aniationTimeDelay = 50;

		this.postFinish = this.options.postFinish;

		this.isActive = false;

		this.focusCtrl = function() {

			if (!self.isActive) self.fadeOut();

		};

	}

	Keep.prototype.finish = function() {

		this.isActive = true;
		if (this.postFinish) this.postFinish();

	};

	Keep.prototype.fadeOut = function() {

		var self = this;

		if (this.frame) {

			self.frame.classList.add('is-fading');

			setTimeout(function() {
				self.frame.classList.remove('is-visible');
			}, this.animationTimeDelay);

			setTimeout(function() {
				self.frame.classList.remove('is-active');
				self.frame.classList.remove('is-fading');
				self.finish();
			}, this.animationTime);

		}

	};

	Keep.prototype.init = function() {

		if (document.hasFocus())
			this.fadeOut();

		addListener(window, 'focus', 'onfocus', this.focusCtrl, false);

	};

	return Keep;

})();
/* Local */

var Local = (function() {

	function Local(map, modal, trigger) {

		var self = this;

		this.map = map;
		this.modal = modal;
		this.trigger = trigger;

		this.mapInited = false;

		this.triggerClickCtrl = function() {

			self.open();

		};

	}

	Local.prototype.initMap = function() {

		var self = this;

		this.mapInited = true;

		setTimeout(function() {

			self.map.init();

		}, 1200);

	};

	Local.prototype.open = function() {

		if (this.modal) this.modal.open();

		if (!this.map.mapInited) this.initMap();

	};

	Local.prototype.init = function() {

		addListener(this.trigger, 'click', 'onclick', this.triggerClickCtrl, false);

	};

	return Local;

})();
/* Logo.js */

var Logo = (function() {

	function Logo(viewport, area) {

		this.viewport = viewport;

		this.area = area || false;

	}

	Logo.prototype.appendTo = function(viewport) {

		viewport.appendChild(this.viewport);

	};

	Logo.prototype.appendToHeader = function() {

		if (this.area)
			if (this.area.header)
				this.appendTo(this.area.header);

	};

	Logo.prototype.init = function() {

	};

	return Logo;

})();
/*!
 * Raiz do Brasil Layout v1.0.0 (http://letsmowe.org/)
 * Copyright 2013-2015 Noibe Developers
 * Licensed under MIT (https://github.com/noibe/villa/blob/master/LICENSE)
 */

var Layout = (function() {

	function Layout(viewport) {

		var self = this;

		this.viewport = viewport;

		this.activeBlock = false;

		this.ctrlResize = function() {

			self.resizeMain();

		};

	}

	/**
	 * Resize the Layout size based on the active block
	 */
	Layout.prototype.resizeMain = function () {

		this.viewport.style.height = this.activeBlock.offsetHeight + 'px';

	};

	/**
	 * If 'o' is a element, it returns the element
	 * Else return false
	 * @param o {object|string}
	 * @return {object|boolean}
	 */
	Layout.prototype.isObject = function(o) {

		if (o) {

			if (typeof o == 'string') {

				for (var i = this.block.length; i--; )
					if (this.block[i].id == o) return this.block[i];

				return false;

			}

			return o;

		}

		return false;

	};

	/**
	 * Remove the classList of the blocks based on 'c'
	 * @param c {Array|string}
	 */
	Layout.prototype.resetClass = function(c) {

		var classList = c ? typeof c == 'string' ? [c] : c : [];

		console.log(classList);

		for (var i = this.block.length; i--; )
			for (var j = classList.length; j--; )
				this.block[i].classList.remove(classList[j]);

	};

	/**
	 * Hide the param block
	 * @param block {object|string}
	 * @param activeBlock {object}
	 */
	Layout.prototype.hideBlock = function(block, activeBlock) {

		block.classList.remove('is-visible');

		// wait and translate
		// is needed to transition be valid
		setTimeout(function() {

			if (block.id != activeBlock.id)
				block.classList.remove('is-active');

		}, 600);


	};

	/**
	 * API to show block
	 * It reset all the active class and show the param block
	 * The param block can be how 'HTML Object Element' or be how 'the string of ID of element'
	 * @param block {object|string}
	 * @param preserveCurrent {boolean}
	 */
	Layout.prototype.showBlock = function(block, preserveCurrent) {

		var self = this;

		if (block = this.isObject(block)) {

			// destroy the current active block
			if (!preserveCurrent)
				if (this.activeBlock)
					this.hideBlock(this.activeBlock, block);

			// celebrate the new active block o/
			this.activeBlock = block;

			// give the active class
			this.activeBlock.classList.add('is-active');

			this.resizeMain();

			history.pushState(false, this.activeBlock.getAttribute('data-history-id'), this.activeBlock.getAttribute('data-history-id'));

			// wait and translate
			// is needed to transition be valid
			setTimeout(function() {

				self.activeBlock.classList.add('is-visible');

			}, 0);

		}

	};

	/**
	 * Show the Active Block
	 * if has a block with 'is-active' class, it will show this
	 */
	Layout.prototype.showActiveBlock = function() {

		var currentActive;

		if (currentActive = this.viewport.querySelector('.Block.is-active'))
			this.showBlock(currentActive, true);

	};

	/**
	 * Get the blocks (with .Block class) from the Layout Viewport
	 * @return {*}
	 */
	Layout.prototype.getBlocks = function() {

		var blocks = this.viewport.querySelectorAll('.Block');

		this.block = blocks ? [] : false;

		if (this.block)
			for (var i = blocks.length; i--; ) {
				this.block.push(blocks[i]);
				if (blocks[i].classList.contains('is-active')) this.activeBlock = blocks[i];
			}

		return this.block;


	};

	Layout.prototype.init = function() {

		if (this.getBlocks()) {

			addListener(window, 'resize', 'onresize', this.ctrlResize, false);

			if (this.activeBlock) this.showActiveBlock();

		}

	};

	return Layout;

})();
/* Mowe Google Maps Controller */

var Maps = (function() {

	var styleArray = [
		{
			featureType: "all",
			stylers: [
				{ saturation: -80 }
			]
		},{
			featureType: "road.arterial",
			elementType: "geometry",
			stylers: [
				{ hue: "#00ffee" },
				{ saturation: 50 }
			]
		},{
			featureType: "poi",
			stylers: [
				{ visibility: "on" }
			]
		}
	];

	/**
	 * The constructor of Mowe Maps
	 * @param viewport {object}
	 * @param apiScript {object}
	 * @param options {object}
	 * @param loadScriptFunction {function} optional
	 * @constructor Maps
	 */
	function Maps(viewport, apiScript, options, loadScriptFunction) {

		var self = this;

		this.viewport = viewport;
		this.apiScript = apiScript;
		this.options = options;

		this.apiScriptURL = 'https://maps.googleapis.com/maps/api/js';

		this.loadScriptFunction = loadScriptFunction;

		this.scriptLoadCtrl = function() {

			self.addDefaultOptions();

			if (self.loadScriptFunction)
				self.loadScriptFunction();
			else self.initMap();

		};

	}

	/**
	 * Init the map
	 */
	Maps.prototype.initMap = function() {

		console.log('starting map');

		console.log(this.options);

		this.map = new google.maps.Map(this.viewport, this.options);

	};

	/**
	 * Add the default options to map
	 */
	Maps.prototype.addDefaultOptions = function () {

		this.options.styles = this.options.styles || styleArray;
		this.options.mapTypeId = google.maps.MapTypeId.ROADMAP;

	};

	/**
	 * Create element of script at DOM
	 */
	Maps.prototype.initAPIScript = function() {

		if (!this.apiScript.src)
			this.apiScript.src = this.apiScriptURL;

		addListener(this.apiScript, 'load', 'onload', this.scriptLoadCtrl, false);

	};

	Maps.prototype.init = function() {

		this.initAPIScript();

	};

	return Maps;

})();

/*!
 * Mowe Modal v1.0.0 (http://letsmowe.com/)
 * Copyright 2013-2016 Kabana's Info Developers
 * Licensed under MIT (https://github.com/noibe/villa/blob/master/LICENSE)
 */

var Modal = (function() {

	/**
	 * The Modal Constructor
	 * @param viewport
	 * @constructor
	 */
	function Modal(viewport) {

		var self = this;

		this.viewport = viewport;

		this.inner = {};

		this.backdrop = {};

		this.active = false;

		this.prevent = false;

		this.triggerCtrl = function() {

			self.toggle();

		};

		this.backdropClickCtrl = function() {

			if (!self.prevent)
				self.close();
			else self.prevent = !self.prevent;

		};

		this.innerClickCtrl = function() {

			self.prevent = true;

		};

		this.openCtrl = function() {

			self.open();

		};

		this.closeCtrl = function() {

			self.close();

		};

		this.escapeCtrl = function(event) {

			if (self.active) {

				var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;

				if (key == 27)
					self.close();

			}

		};

	}

	Modal.prototype.open = function() {

		this.active = true;

		var self = this;

		this.viewport.style.display = 'block';

		setTimeout(function() {

			self.viewport.classList.add('is-active');

		}, 200);

	};

	Modal.prototype.close = function() {

		this.active = false;

		var self = this;

		this.viewport.classList.remove('is-active');

		setTimeout(function() {

			self.viewport.style.display = 'none';

		}, 200);

	};

	Modal.prototype.toggle = function() {

		if (this.active)
			this.close();
		else this.open();

	};

	Modal.prototype.getCloseButton = function() {

		var closeButtons = this.viewport.querySelectorAll('.ModalClose');

		for (var i = closeButtons.length; i--; )
			addListener(closeButtons[i], 'click', 'onclick', this.closeCtrl, false);

	};

	Modal.prototype.getBackDrop = function() {

		if (!(this.backdrop.viewport = this.viewport.querySelector('.ModalBackDrop')))
			this.backdrop.viewport = this.viewport;

		addListener(this.backdrop.viewport, 'click', 'onclick', this.backdropClickCtrl, false);

	};

	Modal.prototype.addListeners = function() {

		var self = this;

		this.getCloseButton();
		this.getBackDrop();

		window.addEventListener('keydown', this.escapeCtrl, false);

	};

	Modal.prototype.getModalInner = function() {

		if (this.inner.viewport = this.viewport.querySelector('.ModalInner'))
			addListener(this.inner.viewport, 'click', 'onclick', this.innerClickCtrl, false);

	};

	Modal.prototype.init = function() {

		this.getModalInner();
		this.addListeners();

		this.active = false;
		this.viewport.style.display = 'none';

	};

	return Modal;

})();
/* Mowe Nav */

var Nav = (function() {

	function Nav(items) {

		var self = this;

		this.items = items;

		/**
		 * Controller to item click events
		 */
		this.itemClickCtrl = function() {

			if (this.fallback)
				this.fallback();

		};

	}

	/**
	 * Add listeners and test the item
	 * @param {object} item
	 */
	Nav.prototype.processItem = function(item) {

		item.menuItem.fallback = item.fallback;
		addListener(item.menuItem, 'click', 'onclick', this.itemClickCtrl, false);

	};

	/**
	 * Process the items list based on a items array
	 * @param {Array} items
	 */
	Nav.prototype.processItems = function(items) {

		var arr = [];

		for (var i = items.length; i--; )
			arr.push(this.processItem(items[i]));

	};

	Nav.prototype.init = function() {

		this.processItems(this.items);

	};

	return Nav;

})();
/* Reps */

var reps = {};

reps.viewport = document.getElementById('reps');

reps.wrapper = document.getElementById('reps-wrapper');

/* Reps Frames Structure */

reps.frames = {};

reps.frames.viewport = document.getElementById('reps-frames');

reps.frames.intro = document.getElementById('reps-intro');

reps.frames.content = document.getElementById('reps-content');

reps.frames.btn = {};

reps.frames.btn.toggle = [];

reps.frames.current = false;

reps.frames.list = [];

reps.frames.resizeViewport = function(size) {

	reps.frames.viewport.style.width = size + 'px';

};

reps.frames.resizeFrames = function(size) {

	reps.frames.intro.style.width = size + 'px';
	reps.frames.content.style.width = size + 'px';

};

reps.frames.resize = function(size, n) {

	reps.frames.resizeViewport(size * n);
	reps.frames.resizeFrames(size);

};

reps.frames.enableAnimation = function() {

	reps.frames.viewport.classList.add('animate');

};

reps.frames.disableAnimation = function() {

	reps.frames.viewport.classList.remove('animate');

};

reps.frames.translate = function(animate) {

	var n, size;

	size = reps.viewport.offsetWidth;

	if (animate) reps.frames.enableAnimation();

	reps.frames.resize(size, 2);

	n = (reps.frames.intro.classList.contains('active')) ? 0 : -1;

	reps.frames.intro.style.transform = 'translateX(' + size * n + 'px)';
	reps.frames.content.style.transform = 'translateX(' + size * ( n + 1 ) + 'px)';

	if (animate) setTimeout(reps.frames.disableAnimation, 500);

};

reps.frames.updateCurrent = function() {

	// solução temporaria
	// alterna entre reps-intro e reps-content

	if (reps.frames.current) {

		if (reps.frames.intro.classList.contains('active')) {

			reps.frames.intro.classList.remove('active');
			reps.frames.content.classList.add('active');
			reps.frames.current = reps.frames.content;

		} else {

			reps.frames.intro.classList.add('active');
			reps.frames.content.classList.remove('active');
			reps.frames.current = reps.frames.intro;

		}

		reps.frames.translate(true);

	} else {

		reps.frames.current = reps.frames.intro;

		reps.frames.translate(false);

	}

	//reps.frames.resize(reps.viewport.offsetWidth, 2);

};

reps.frames.btn.toggleCtrl = function() {

	reps.frames.updateCurrent();

};

reps.frames.btn.addListeners = function() {

	for (var i = reps.frames.btn.toggle.length; i--; )
		reps.frames.btn.toggle[i].addEventListener('click', reps.frames.btn.toggleCtrl);

	window.addEventListener('resize', function() {
		reps.frames.translate(false);
	});

};

reps.frames.btn.getButtons = function () {

	var i, e;

	e = reps.frames.viewport.querySelectorAll('.toggle');

	for (i = e.length; i--; )
		reps.frames.btn.toggle.push(e[i]);

};

reps.frames.btn.init = function() {

	reps.frames.btn.getButtons();
	reps.frames.btn.addListeners();

};

reps.frames.init = function() {

	reps.frames.updateCurrent();
	reps.frames.btn.init();

};

/* Reps List */

reps.list = {};

reps.list.viewport = document.getElementById('reps-list');

reps.list.buildRepWebSite = function(link) {

	var website = document.createElement('div');
	website.classList.add('rep-website');
	website.classList.add('link');

	var a = document.createElement('a');
	a.href = link.url;

	var icon = document.createElement('span');
	icon.classList.add('icon');
	icon.classList.add('icon-globe');

	var span = document.createElement('span');
	span.innerHTML = 'Site';

	a.appendChild(icon);
	a.appendChild(span);

	website.appendChild(a);

	return website;

};

reps.list.buildRepEmail = function(link) {

	var email = document.createElement('div');
	email.classList.add('rep-email');
	email.classList.add('link');

	var a = document.createElement('a');
	a.href = link.url;

	var icon = document.createElement('span');
	icon.classList.add('icon');
	icon.classList.add('icon-mail');

	var span = document.createElement('span');
	span.innerHTML = 'E-mail';

	a.appendChild(icon);
	a.appendChild(span);

	email.appendChild(a);

	return email;

};

reps.list.buildRepPhone = function(text) {

	var phone = document.createElement('div');
	phone.classList.add('rep-phone');

	var a = document.createElement('a');

	var span = document.createElement('span');
	span.innerHTML = text;

	phone.appendChild(span);

	return phone;

};

reps.list.buildRepAddress = function(text) {

	var address = document.createElement('div');
	address.classList.add('rep-address');

	var span = document.createElement('span');
	span.innerHTML = text;

	address.appendChild(span);

	return address;

};

reps.list.buildRepTitle = function(text) {

	var title = document.createElement('div');
	title.classList.add('rep-title');

	var span = document.createElement('span');
	span.innerHTML = text;

	title.appendChild(span);

	return title;

};

reps.list.repCtrlClick = function(r) {

	reps.map.map.setCenter(r.marker.getPosition());
	reps.map.map.setZoom(17);

};

reps.list.buildRep = function(r) {

	var rep = document.createElement('li');
	rep.classList.add('rep');

	var repInner = document.createElement('div');
	repInner.classList.add('rep-inner');

	var repHeader = document.createElement('header');
	repHeader.classList.add('rep-header');

	if (r.title) repHeader.appendChild(reps.list.buildRepTitle(r.title));
	if (r.address) repHeader.appendChild(reps.list.buildRepAddress(r.address));
	if (r.phone) repHeader.appendChild(reps.list.buildRepPhone(r.phone));

	var repFooter = document.createElement('footer');
	repFooter.classList.add('rep-footer');

	if (r.email) repFooter.appendChild(reps.list.buildRepEmail(r.email));
	if (r.website) repFooter.appendChild(reps.list.buildRepWebSite(r.website));

	repInner.appendChild(repHeader);
	repInner.appendChild(repFooter);

	rep.appendChild(repInner);

	rep.addEventListener('click', function() {
		reps.list.repCtrlClick(r);
	});

	return rep;

};

reps.list.build = function(r) {

	r.element = reps.list.buildRep(r);
	reps.list.viewport.appendChild(r.element);

	setTimeout(function() {

		r.element.classList.add('build');

	}, 200);

};

reps.list.destroy = function(r) {

	r.element.classList.remove('build');

	setTimeout(function() {

		if (r.element) {

			reps.list.viewport.removeChild(r.element);
			r.element = false;

		}

	}, 400);

};

reps.list.update = function(bounds) {

	var i;

	if (!bounds) {

		for (i = reps.list.data.length; i--; )
			reps.list.build(reps.list.data[i]);

	} else {

		for (i = reps.list.data.length; i--; ) {

			if (bounds.contains(reps.list.data[i].marker.getPosition())) {

				if (!reps.list.data[i].element) reps.list.build(reps.list.data[i]);

			} else if (reps.list.data[i].element) reps.list.destroy(reps.list.data[i]);

		}

	}

};

reps.list.init = function() {

	reps.list.update(false);

};

/* Reps Map */

reps.map = {};

reps.map.viewport = document.getElementById('reps-map');

reps.map.canvas = reps.map.viewport;

reps.map.center = {
	lat: -22.7753073,
	lng: -50.2077834
};

reps.map.zoom = 11;

reps.map.styles = [
	{
		featureType: "all",
		stylers: [
			{ saturation: -80 }
		]
	},{
		featureType: "road.arterial",
		elementType: "geometry",
		stylers: [
			{ hue: "#00ffee" },
			{ saturation: 50 }
		]
	},{
		featureType: "poi",
		stylers: [
			{ visibility: "on" }
		]
	}
];

reps.map.options = {};

reps.map.markers = {};

reps.map.markers.add = function(marker, map) {

	return new google.maps.Marker({
		map: map,
		position: marker.position,
		title: marker.title
	});

};

reps.map.markers.addAll = function(map) {

	for (var i = reps.list.data.length; i--; )
		reps.list.data[i].marker = (reps.map.markers.add(reps.list.data[i], map));

};

reps.map.markers.recalculating = false;

reps.map.markers.startCalculation = function() {

	reps.map.markers.recalculating = true;

};

reps.map.markers.finishRecalculation = function() {

	reps.map.markers.recalculating = false;

	reps.list.update(reps.map.map.getBounds());

};

reps.map.markers.boundsChangeCtrl = function() {

	if (!reps.map.markers.recalculating) {

		reps.map.markers.startCalculation();

		reps.list.update(reps.map.map.getBounds());

		setTimeout(reps.map.markers.finishRecalculation, 1000);

	}

};

reps.map.init = function() {

	reps.map.options = {
		scrollwheel: false,
		center: reps.map.center,
		zoom: reps.map.zoom,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: reps.map.styles
	};

	reps.map.map = new google.maps.Map(reps.map.canvas, reps.map.options);
	reps.map.markers.addAll(reps.map.map);

	google.maps.event.addListener(reps.map.map, 'bounds_changed', reps.map.markers.boundsChangeCtrl);

};

reps.init = function() {

	reps.frames.init();

	//reps.map.init();
	//reps.list.init();

};
var select = {};
/*!
 * Mowe Swipe v0.7.5
 */

var Swipe = (function() {

	function Swipe(viewport) {

		var self = this;

		this.viewport = viewport;

		this.frames = [];

		this.resizeDelay = false;

		this.resizeDelayTime = 1000;

		this.clickCtrl = function() {

			for (var i = self.frames.length; i--; )
				self.frames[i].classList.remove('is-active');

			if (this.swipeTarget) this.swipeTarget.classList.add('is-active');

		};

		this.resizeDelayAction = function() {

			self.resize();

			// set false the resizeDelay
			self.resizeDelay = false;

		};

		this.resizeCtrl = function() {

			clearTimeout(self.resizeDelay);
			self.resizeDelay = false;
			self.resizeDelay = setTimeout(self.resizeDelayAction, self.resizeDelayTime);

		};

	}

	/**
	 * Get the bigger frame height value and give it to viewport height
	 */
	Swipe.prototype.resize = function() {

		this.viewport.style.height = 'auto';

		var bigger = 0;

		for (var i = this.frames.length; i--; )
			if (this.frames[i].offsetHeight > bigger)
				bigger = this.frames[i].offsetHeight;

		this.viewport.style.height = ( bigger ) + 'px';

	};

	Swipe.prototype.processItem = function(item) {

		item.item.swipeTarget = item.swipeTarget;
		addListener(item.item, 'click', 'onclick', this.clickCtrl, false);

	};

	Swipe.prototype.processItems = function(items) {

		for (var i = items.length; i--; )
			this.processItem(items[i]);

	};

	Swipe.prototype.getFrames = function() {

		var frames = this.viewport.querySelectorAll('.SwipeFrame');

		for (var i = frames.length; i--; )
			this.frames.push(frames[i]);

	};

	Swipe.prototype.init = function(items) {

		var self = this;

		this.getFrames();

		this.processItems(items);

		addListener(window, 'resize', 'onresize', this.resizeCtrl, false);
		this.resize();

	};

	return Swipe;

})();
/* Toggle */

var Toggle = (function(){

	function Toggle(viewport, nav) {

		var self = this;

		this.viewport = viewport;

		this.nav = {};
		this.nav.viewport = nav;

		this.isActive = false;

		this.clickCtrl = function() {

			self.toggle();

		};

	}

	Toggle.prototype.open = function() {

		this.isActive = true;
		this.viewport.classList.add('is-active');
		this.nav.viewport.classList.add('is-active');

	};

	Toggle.prototype.close = function() {

		this.isActive = false;
		this.viewport.classList.remove('is-active');
		this.nav.viewport.classList.remove('is-active');

	};

	Toggle.prototype.toggle = function() {

		if (this.isActive) this.close();
		else this.open();

	};

	Toggle.prototype.init = function() {

		this.close();

		addListener(this.viewport, 'click', 'onclick', this.clickCtrl, false);

	};

	return Toggle;

})();