"use strict";

var extend = require('extend');
var http = require("./libs/http");
var config = require("./libs/config");
var Pay = require("./libs/pay");

var BigNumber = require("bignumber.js");

var NAS = "NAS";

var NebPay = function (appKey, appSecret) {
	this._pay = new Pay(appKey, appSecret);
};

NebPay.config = config;

var defaultOptions = {
	goods: {
		name: "",
		desc: "",
		orderId: "",
		ext: ""
	},
	qrcode: {
		showQRCode: true,
		completeTip: undefined, // string of complete payment tip
		cancelTip: undefined, // string of cancel payment tip
		container: undefined
	},
	extension: {
		openExtension: true //set if need show extension payment mode
	},

	mobile: {
		showInstallTip: true,
		installTip: undefined // string of install NASNano tip
	},

	// callback is the return url after payment
	//callback: config.payUrl,
	callback: undefined,

	//listener：specify a listener function to handle payment feedback message(only valid for browser extension)
	listener: undefined,

	// if use nrc20pay ,should input nrc20 params like address, name, symbol, decimals
	nrc20: undefined,

	// if debug mode, should open testnet nano and reset the callback
	debug: false
};

NebPay.prototype = {
	pay: function (to, value, options) {
		var payload = {
			type: "binary"
		};
		options = extend(defaultOptions, options);
		return this._pay.submit(NAS, to, value, payload, options);
	},
	nrc20pay: function (currency, to, value, options) {
		if (options.nrc20 && options.nrc20.decimals > 0) {
			value = value || "0";
			value = new BigNumber(value).times(new BigNumber(10).pow(options.nrc20.decimals)).toString(10);
		}
        var address = "";
        if (options.nrc20 && options.nrc20.address) {
            address = options.nrc20.address;
		}

		var args = [to, value];
		var payload = {
			type: "call",
			function: "transfer",
			args: JSON.stringify(args)
		};
		options = extend(defaultOptions, options);
		return this._pay.submit(currency, address, "0", payload, options);
	},
	deploy: function (source, sourceType, args, options) {
		var payload = {
			type: "deploy",
			source: source,
			sourceType: sourceType,
			args: args
		};
		options = extend(defaultOptions, options);
		return this._pay.submit(NAS, "", "0", payload, options);
	},
	call: function (to, value, func, args, options) {
		var payload = {
			type: "call",
			function: func,
			args: args
		};
		options = extend(defaultOptions, options);
		return this._pay.submit(NAS, to, value, payload, options);
	},
    simulateCall: function (to, value, func, args, options) {	//this API will not be supported in the future
        var payload = {
            type: "simulateCall",
            function: func,
            args: args
        };
        options = extend(defaultOptions, options);

        return this._pay.submit(NAS, to, value, payload, options);
	},
	queryPayInfo: function(serialNumber, options) {
		options = extend(defaultOptions, options);
		var url = options.callback || config.payUrl(options.debug);
        url = url + "/query?payId=" + serialNumber;
		return http.get(url);
	}
};

module.exports = NebPay;

