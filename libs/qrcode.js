"use strict";

var QRCode = require('qrcode');

var addCssRule = function() {
    function createStyleSheet() {
        var style = document.createElement('style');
        style.type = 'text/css';
        document.head.appendChild(style);
        return style.sheet;
    }
  
    var sheet = createStyleSheet();
  
    return function(selector, rules, index) {
        index = index || 0;
        sheet.insertRule(selector + "{" + rules + "}", index);
    };
}();

var createDeaultQRContainer = function() {
	var canvas = document.createElement("canvas");
	canvas.className = "qrcode";
	var canvasStyle = "box-shadow: 2px 2px 12px lightgray;";
	addCssRule(".qrcode", canvasStyle);

	var qrcontainer = document.createElement("div");
	qrcontainer.className = "qrcode-container";
  var style = ("text-align: center;\
    background-color: #fff0;\
    border-radius: 20px;\
    width: 300px;\
    height: 300px;\
    position: absolute;\
    left: 50%;\
    top: 50%;\
    transform: translate(-50%,-50%);");
	addCssRule(".qrcode-container", style);
	qrcontainer.appendChild(canvas);

	var background = document.createElement("div");
	background.className = "qrcode-background";
	style = "position:absolute;\
	left:0;\
	top:0;\
	z-index:100;\
	height:100%;\
	width:100%;\
	background-color: rgba(0, 0, 0, 0.4);";
	addCssRule(".qrcode-background", style);
	background.appendChild(qrcontainer);

	var body = document.getElementsByTagName("body");
	body[0].appendChild(background);

	background.onclick = function () {
		body[0].removeChild(background);
	};

	return canvas;
};

var showQRCode = function (content, container) {
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

module.exports = {
	showQRCode: showQRCode
};
