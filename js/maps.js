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
