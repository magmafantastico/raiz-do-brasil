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