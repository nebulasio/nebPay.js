"use strict";

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
		var params = {
			category: "jump",
			des: "productDetail",
			serialNumber: options.serialNumber,
			goods:options.goods,
			pay: {
				currency: currency,
				to: to,
				value: value,
				payload: payload
			}
		};
		var paramsStr = JSON.stringify(params);

		if (Utils.isChrome()) {
			openExtension(paramsStr);
		} else {
			openApp(paramsStr);
		}
		if (options.qrcode.showQRCode) {
			showQRCode(paramsStr, options);
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
		var url = "openapp.NASnano://virtual?params=" + params;
		window.location.href = url;
	}
}

function showQRCode(params, options) {
	QRCode.showQRCode(params, options.qrcode.container);
}

module.exports = Pay;