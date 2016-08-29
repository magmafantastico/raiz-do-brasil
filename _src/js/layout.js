
/* Layout */

var Layout = (function() {

	function Layout(element) {

		var self = this;

		this.element = element;

		this.activeBlock = false;

		this.ctrlResize = function() {

			self.resizeMain();

		};

	}

	/**
	 * Resize the Layout size based on the active block
	 */
	Layout.prototype.resizeMain = function () {

		if (this.inner)
			this.inner.style.height = this.activeBlock.offsetHeight + 'px';
		else
			this.element.style.height = this.activeBlock.offsetHeight + 'px';

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

		if (currentActive = this.element.querySelector('.Block.is-active'))
			this.showBlock(currentActive, true);

	};

	/**
	 * Get the blocks (with .Block class) from the Layout element
	 * @return {*}
	 */
	Layout.prototype.getBlocks = function() {

		var blocks = this.element.querySelectorAll('.Block');

		this.block = blocks ? [] : false;

		if (this.block)
			for (var i = blocks.length; i--; ) {
				this.block.push(blocks[i]);
				if (blocks[i].classList.contains('is-active')) this.activeBlock = blocks[i];
			}

		return this.block;


	};

	Layout.prototype.getElements = function () {

		this.inner = this.element.querySelector('.Main-inner');

	};

	Layout.prototype.init = function() {

		this.getElements();

		if (this.getBlocks()) {

			addListener(window, 'resize', 'onresize', this.ctrlResize, false);

			if (this.activeBlock) this.showActiveBlock();

		}

	};

	return Layout;

})();