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
	// callback is the return url/func after payment
	callback: undefined,
	// if use nrc20pay ,should input nrc20 params like name, symbol, decimals
	nrc20: undefined
};

NebPay.prototype = {
	pay: function (to, value, options) {
		var payload = {
			type: "binary"
		};
		options = extend(defaultOptions, options);
		this._pay.submit(NAS, to, value, payload, options);
	},
	nrc20pay: function (currency, to, value, options) {
		val 
		var args = [to, value];
		var payload = {
			type: "call",
			function: "transfer",
			args: JSON.stringify(args)
		};
		options = extend(defaultOptions, options);
		this._pay.submit(currency, "", value, payload, options);
	},
	deploy: function (source, sourceType, args, options) {
		var payload = {
			type: "deploy",
			source: source,
			sourceType: sourceType,
			args: args
		};
		options = extend(defaultOptions, options);
		this._pay.submit(NAS, "", "0", payload, options);
	},
	call: function (to, value, func, args, options) {
		var payload = {
			type: "call",
			function: func,
			args: args
		};
		options = extend(defaultOptions, options);
		this._pay.submit(NAS, to, value, payload, options);
	}
};

module.exports = NebPay;

