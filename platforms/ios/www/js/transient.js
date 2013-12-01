/**
 * transient.js
 * Joshua Dickson
 */

/**
 * A utility for generating generic transient equations that are used to build
 * bouncing, live UI elements
 */
var Transients = {

	// A basic transient effects equation
	getBasicTransient: function(x) {
		return 1 - (Math.pow(Math.E, -6 * x) * Math.cos(16 * x));
	},

	// A transient effects equation with configurable exponent and cosine coefficient
	getEasedTransient: function(x, exponent, cosCoeff) {
		return 1 - (Math.pow(Math.E, -1 * exponent * x) * Math.cos(cosCoeff * x));
	}

}