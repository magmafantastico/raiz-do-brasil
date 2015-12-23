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