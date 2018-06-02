"use strict";

var isChrome = function() {
    if (typeof window !== "undefined") {
        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.match(/chrome\/([\d\.]+)/))  {
            return true;
        }
    } 
    return false;
};

var isMobile = function() {
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("mobile") > -1)  {
        return true;
    }
    return false;
};

var isNano = function() {
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("nasnanoapp") > -1)  {
        return true;
    }
    return false;
};

var isWechat = function () {
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("micromessenger") > -1)  {
        return true;
    }
    return false;
};

var randomCode = function (len) {
    var d,
        e,
        b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        c = "";
        for (d = 0; len > d; d += 1){
            e = Math.random() * b.length;
            e = Math.floor(e);
            c += b.charAt(e);
        }
        return c;
};

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

module.exports = {
    isChrome: isChrome,
    isMobile: isMobile,
    isNano: isNano,
    isWechat: isWechat,
    randomCode: randomCode,
    addCssRule: addCssRule
};
