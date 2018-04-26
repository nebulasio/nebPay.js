"use strict";

var extend = require('extend');
var Pay = require("./libs/pay");

var NAS = "NAS";

var NebPay = function (appKey, appSecret) {
	this._pay = new Pay(appKey, appSecret);
};

var defaultOptions = {
	goods: {
		name: "",
		desc: "",
		orderId: "",
		ext: ""
	},
	qrcode: {
		showQRCode: false,
		container: undefined
	},
	// callback url is the return url after payment
	callbackUrl: ""
};

NebPay.prototype = {
	pay: function (to, value, options) {
		options = extend(defaultOptions, options);
		this._pay.submit(NAS, to, value, null, options);
	},
	nrc20pay: function (currency, to, value, func, args, options) {
		var payload = {
			function: func,
			args: args
		};
		options = extend(defaultOptions, options);
		this._pay.submit(currency, to, value, payload, options);
	},
	deploy: function (source, sourceType, args, options) {
		var payload = {
			source: source,
			sourceType: sourceType,
			args: args
		};
		options = extend(defaultOptions, options);
		this._pay.submit(NAS, "", "0", payload, options);
	},
	call: function (to, value, func, args, options) {
		var payload = {
			function: func,
			args: args
		};
		options = extend(defaultOptions, options);
		this._pay.submit(NAS, to, value, payload, options);
	}
};

module.exports = NebPay;

