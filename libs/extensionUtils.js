"use strict";

var Utils = require("./Utils");

var callbackMap = {};

var openExtension = function (params) {

    if(params.callback){
        callbackMap[params.serialNumber] = params;
    }
    params.callback = undefined;     //postMessage can't contains a function attr

    window.postMessage({
        "src" : "nebPay",
        "logo" : "nebulas",  //to distinguish from other messages
        "params" : params
    },"*");

};

window.addEventListener('message', function(resp) {

    console.log("nebpay: received resp.data: " + JSON.stringify(resp.data));
    if(resp.data.src !== "content")
        return;

    var key = resp.data.serialNumber;
    var params = callbackMap[key];
    if(params){
        var callback = params.callback;
        if(typeof callback === "function"){
            callback(resp.data);
        }
    }
    //delete callbackMap[key];

});


module.exports = openExtension;
