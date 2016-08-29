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