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
	var canvasStyle = `box-shadow: 2px 2px 12px lightgray;`;
	addCssRule(".qrcode", canvasStyle);

	var qrcontainer = document.createElement("div");
	qrcontainer.className = "qrcode-container";
	var style = `display: flex; align-items: center; justify-content: center;
	min-height: 300px; min-width: 300px; padding: 10px;
	background-color: ghostwhite;`;
	addCssRule(".qrcode-container", style);
	qrcontainer.appendChild(canvas);

	var background = document.createElement("div");
	qrcontainer.className = "qrcode-background";
	style = `with:100%; height:100%;background-color: rgba(0, 0, 0, 0.5);`;
	addCssRule(".qrcode-background", style);
	background.appendChild(qrcontainer);
	background.onclick = function () {
		window.removeChild(background);
	};
	window.appendChild(background);

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
