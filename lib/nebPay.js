(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('qrcode'), require('bignumber.js'), require('extend')) :
  typeof define === 'function' && define.amd ? define(['qrcode', 'bignumber.js', 'extend'], factory) :
  (global.nebPay = global.nebPay || {}, global.nebPay.js = factory(global.QRCode,global.BigNumber,global.extend));
}(this, (function (QRCode,BigNumber,extend) { 'use strict';

  QRCode = QRCode && QRCode.hasOwnProperty('default') ? QRCode['default'] : QRCode;
  BigNumber = BigNumber && BigNumber.hasOwnProperty('default') ? BigNumber['default'] : BigNumber;
  extend = extend && extend.hasOwnProperty('default') ? extend['default'] : extend;

  var get = function get(url, body) {
      var obj = {
          url: url,
          method: "GET",
          body: body
      };
      return request(obj);
  };

  var post = function post(url, body) {
      var obj = {
          url: url,
          method: "POST",
          body: body
      };
      return request(obj);
  };

  var request = function request(obj) {
      return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open(obj.method || "GET", obj.url);
          if (obj.headers) {
              Object.keys(obj.headers).forEach(function (key) {
                  xhr.setRequestHeader(key, obj.headers[key]);
              });
          }
          xhr.onload = function () {
              if (xhr.status >= 200 && xhr.status < 300) {
                  resolve(xhr.response);
              } else {
                  reject(xhr.statusText);
              }
          };
          xhr.onerror = function () {
              return reject(xhr.statusText);
          };
          xhr.send(obj.body);
      });
  };

  var http = {
      get: get,
      post: post,
      request: request
  };

  var payUrl = "https://pay.nebulas.io/api/pay";

  var config = {
    payUrl: payUrl
  };

  var isChrome = function isChrome() {
      if (typeof window !== "undefined") {
          var userAgent = navigator.userAgent.toLowerCase();
          if (userAgent.match(/chrome\/([\d\.]+)/)) {
              return true;
          }
      }
      return false;
  };

  var randomCode = function randomCode(len) {
      var d,
          e,
          b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
          c = "";
      for (d = 0; len > d; d += 1) {
          e = Math.random() * b.length;
          e = Math.floor(e);
          c += b.charAt(e);
      }
      return c;
  };

  var Utils = {
      isChrome: isChrome,
      randomCode: randomCode
  };

  var addCssRule = function () {
  	function createStyleSheet() {
  		var style = document.createElement('style');
  		style.type = 'text/css';
  		document.head.appendChild(style);
  		return style.sheet;
  	}

  	var sheet = createStyleSheet();

  	return function (selector, rules, index) {
  		index = index || 0;
  		sheet.insertRule(selector + "{" + rules + "}", index);
  	};
  }();

  var createDeaultQRContainer = function createDeaultQRContainer() {
  	var canvas = document.createElement("canvas");
  	canvas.className = "qrcode";
  	var canvasStyle = 'box-shadow: 2px 2px 12px lightgray;';
  	addCssRule(".qrcode", canvasStyle);

  	var qrcontainer = document.createElement("div");
  	qrcontainer.className = "qrcode-container";
  	var style = 'text-align: center;\n    background-color: #fff0;\n    border-radius: 20px;\n    width: 300px;\n    height: 300px;\n    position: absolute;\n    left: 50%;\n    top: 50%;\n    transform: translate(-50%,-50%);';
  	addCssRule(".qrcode-container", style);
  	qrcontainer.appendChild(canvas);

  	var background = document.createElement("div");
  	background.className = "qrcode-background";
  	style = 'position:absolute;\n\tleft:0;\n\ttop:0;\n\tz-index:100;\n\theight:100%;\n\twidth:100%;\n\tbackground-color: rgba(0, 0, 0, 0.4);';
  	addCssRule(".qrcode-background", style);
  	background.appendChild(qrcontainer);

  	var body = document.getElementsByTagName("body");
  	body[0].appendChild(background);

  	background.onclick = function () {
  		body[0].removeChild(background);
  	};

  	return canvas;
  };

  var showQRCode = function showQRCode(content, container) {
  	if (typeof window === "undefined") {
  		return;
  	}
  	if (typeof container === "undefined") {
  		container = createDeaultQRContainer();
  	}
  	QRCode.toCanvas(container, content, function (error) {
  		if (error) {
  			console.error(error);
  		}
  	});
  };

  var QRCode$1 = {
  	showQRCode: showQRCode
  };

  var callbackMap = {};

  var openExtension = function openExtension(params) {

      if (params.listener) {
          callbackMap[params.serialNumber] = params.listener;
      }

      params.listener = undefined;

      window.postMessage({
          "src": "nebPay",
          "logo": "nebulas",
          "params": params
      }, "*");
  };

  window.addEventListener('message', function (resp) {

      console.log("nebpay: received resp.data: " + JSON.stringify(resp.data));
      if (resp.data.src !== "content") return;

      var key = resp.data.serialNumber;
      var callback = callbackMap[key];
      if (typeof callback === "function") {
          callback(resp.data.resp);
      }
  });

  var Pay = function Pay(appKey, appSecret) {
  	this.appKey = appKey;
  	this.appSecret = appSecret;
  };

  Pay.prototype = {
  	submit: function submit(currency, to, value, payload, options) {
  		options.serialNumber = Utils.randomCode(32);
  		value = value || "0";
  		var amount = new BigNumber(value).times("1000000000000000000");
  		var params = {
  			serialNumber: options.serialNumber,
  			goods: options.goods,
  			pay: {
  				currency: currency,
  				to: to,
  				value: amount.toString(10),
  				payload: payload
  			},
  			callback: options.callback,
  			listener: options.listener,
  			nrc20: options.nrc20
  		};

  		openExtension(params);
  		openApp(params, options);

  		return options.serialNumber;
  	}
  };

  function openApp(params, options) {
  	var appParams = {
  		category: "jump",
  		des: "confirmTransfer",
  		pageParams: params
  	};
  	var url = "openapp.NASnano://virtual?params=" + JSON.stringify(appParams);
  	window.location.href = url;

  	if (options.qrcode.showQRCode) {
  		showQRCode$1(JSON.stringify(appParams), options);
  	}
  }

  function showQRCode$1(params, options) {
  	QRCode$1.showQRCode(params, options.qrcode.container);
  }

  var NAS = "NAS";

  var NebPay = function NebPay(appKey, appSecret) {
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

  	callback: config.payUrl,

  	listener: undefined,

  	nrc20: undefined
  };

  NebPay.prototype = {
  	pay: function pay(to, value, options) {
  		var payload = {
  			type: "binary"
  		};
  		options = extend(defaultOptions, options);
  		return this._pay.submit(NAS, to, value, payload, options);
  	},
  	nrc20pay: function nrc20pay(currency, to, value, options) {
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
  	deploy: function deploy(source, sourceType, args, options) {
  		var payload = {
  			type: "deploy",
  			source: source,
  			sourceType: sourceType,
  			args: args
  		};
  		options = extend(defaultOptions, options);
  		return this._pay.submit(NAS, "", "0", payload, options);
  	},
  	call: function call(to, value, func, args, options) {
  		var payload = {
  			type: "call",
  			function: func,
  			args: args
  		};
  		options = extend(defaultOptions, options);
  		return this._pay.submit(NAS, to, value, payload, options);
  	},
  	simulateCall: function simulateCall(to, value, func, args, options) {
  		var payload = {
  			type: "simulateCall",
  			function: func,
  			args: args
  		};
  		options = extend(defaultOptions, options);
  		return this._pay.submit(NAS, to, value, payload, options);
  	},
  	queryPayInfo: function queryPayInfo(serialNumber) {
  		var url = config.payUrl + "/query?payId=" + serialNumber;
  		return http.get(url);
  	}
  };

  return NebPay;

})));
