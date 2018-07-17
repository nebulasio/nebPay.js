"use strict";

var BigNumber = require("bignumber.js");

var Utils = require("./Utils");
var QRCode = require("./qrcode");

var openExtension = require("./extensionHandler");
var openApp = require("./appHandler");
var config = require("./config");

var Pay = function (appKey, appSecret) {
	// TODO: currently not use
	this.appKey = appKey;
	this.appSecret = appSecret;
};
var TransactionMaxGasPrice = "1000000000000";
var TransactionMaxGas = "50000000000";

Pay.prototype = {
	/*jshint maxcomplexity:6 */
	submit: function (currency, to, value, payload, options) {
		options.serialNumber = Utils.randomCode(32);
		value = value || "0";
		var amount = new BigNumber(value).times("1000000000000000000");//10^18

		var gasLimitBN, gasPriceBN;
		if(!!options.gasLimit) {
            gasLimitBN = new BigNumber(options.gasLimit);  //check validity of gasPrice & gasLimit
            if (gasLimitBN.lt(0)) throw new Error("gas limit should not be minus");
            if (gasLimitBN.gt(TransactionMaxGas)) throw new Error("gas limit should smaller than " + TransactionMaxGas);
            if (!gasLimitBN.isInteger()) throw new Error("gas limit should be integer");
        }

        if(!!options.gasPrice) {
            gasPriceBN = new BigNumber(options.gasPrice);
            if (gasPriceBN.lt(0)) throw new Error("gas price should not be minus");
            if (gasPriceBN.gt(TransactionMaxGasPrice)) throw new Error("gas price should smaller than " + TransactionMaxGasPrice);
            if (!gasPriceBN.isInteger()) throw new Error("gas price should be integer");
        }

		var params = {
			serialNumber: options.serialNumber,
			goods:options.goods,
			pay: {
				currency: currency,
				to: to,
				value: amount.toString(10),
				payload: payload,
				gasLimit: !!gasLimitBN ? gasLimitBN.toString(10) : undefined,
				gasPrice: !!gasPriceBN ? gasPriceBN.toString(10) : undefined
    		},
            callback: options.callback || config.payUrl(options.debug),
            listener: options.listener,
			nrc20: options.nrc20
		};

		if (Utils.isChrome() && !Utils.isMobile() && options.extension.openExtension) {
			if(Utils.isExtInstalled())
				openExtension(params);
			else {
                //window.alert("NasExtWallet is not installed.");
                if (window.confirm('NasExtWallet is not installed. Click "ok" to install it.'))
                {
                    window.open('https://chrome.google.com/webstore/detail/nasextwallet/gehjkhmhclgnkkhpfamakecfgakkfkco');
                }
            }
		}

		var appParams = {
			category: "jump",
			des: "confirmTransfer",
			pageParams: params
		};

		if (Utils.isMobile()) {
			openApp(appParams, options);
		}

		if (options.qrcode.showQRCode && !Utils.isNano()) {
			QRCode.showQRCode(JSON.stringify(appParams), options);
		}
		
		return options.serialNumber;
	}
};

module.exports = Pay;