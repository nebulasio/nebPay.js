"use strict";

var BigNumber = require("bignumber.js");

var Utils = require("./Utils");
var QRCode = require("./qrcode");

var Pay = function (appKey, appSecret) {
	// TODO: currently not use
	this.appKey = appKey;
	this.appSecret = appSecret;
};

Pay.prototype = {
	submit: function (currency, to, value, payload, options) {
		options.serialNumber = Utils.randomCode(32);
		var amount = new BigNumber(value).times("1000000000000000000");
		var params = {
			serialNumber: options.serialNumber,
			goods:options.goods,
			pay: {
				currency: currency,
				to: to,
				value: amount,
				payload: payload
			},
			callback: options.callback
		};
		var paramsStr = JSON.stringify(params);

		if (Utils.isChrome()) {
			openExtension(params);
		} else {
			openApp(params);
		}
		if (options.qrcode.showQRCode) {
			showQRCode(JSON.stringify(params), options);
		}
		return options.serialNumber;
	}
};

function openExtension(params) {
	// TODO: start chrom extension
	if (typeof window !== "undefined") {
		window.postMessage(params,"*");
	}
}

function openApp(params) {
	if (typeof window !== "undefined") {
		params.callback = "http://18.221.150.42/api/pay";
		var appParams = {
			category: "jump",
			des: "confirmTransfer",
			pageParams: params
		};
		var url = "openapp.NASnano://virtual?params=" + JSON.stringify(appParams);
		window.location.href = url;
	}
}

function showQRCode(params, options) {
	QRCode.showQRCode(params, options.qrcode.container);
}

module.exports = Pay;