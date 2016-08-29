
/* Nav */

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

		if (item) {

			item.menuItem.fallback = item.fallback;
			addListener(item.menuItem, 'click', 'onclick', this.itemClickCtrl, false);

		}

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