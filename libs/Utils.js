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

module.exports = {
    isChrome: isChrome,
    randomCode: randomCode
};
