
/* Recipe */

var Recipe = (function () {

	/**
	 * Recipe constructor
	 * @constructor
	 */
	function Recipe(element) {

		var self = this;

		this.element = element;

		this.onResizeFallback = false;

		this.onResize = function () {

			self.updateHeaderSize();

			if (self.onResizeFallback)
				self.onResizeFallback();

		};

		this.delay = false;

		if (this.element)
			this.init();

	}

	Recipe.prototype.updateHeaderSize = function () {

		try {

			this.header.style.minHeight = ( this.header.offsetWidth * 0.888888889 ) + 'px';

			if (this.header.offsetWidth > 0)
				clearInterval(this.delay);

		} catch (e) { }

	};

	Recipe.prototype.addListeners = function () {

		try {

			window.addEventListener('resize', this.onResize);

			if (this.header.offsetWidth == 0) {

				var self = this;

				this.delay = setInterval(function () {

					self.updateHeaderSize();

				}, 1000);

			}

		} catch (e) { }

	};

	Recipe.prototype.setHeaderBackground = function () {

		if (this.image && this.header)
			this.header.style.backgroundImage = 'url("' + this.image.src + '")';

	};

	Recipe.prototype.getElements = function () {

		this.body = this.element.querySelector('.Recipe-body');
		this.header = this.element.querySelector('.Recipe-header');
		this.image = this.element.querySelector('.Recipe-image');

	};

	Recipe.prototype.init = function () {

		var self = this;

		this.getElements();
		this.setHeaderBackground();
		this.addListeners();
		this.updateHeaderSize();

	};

	return Recipe;

})();