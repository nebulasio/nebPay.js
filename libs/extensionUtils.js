"use strict";

var callbackMap = {};

var openExtension = function (params) {

    if(params.listener){
        callbackMap[params.serialNumber] = params.listener;
    }
    //params.callback = undefined;     //postMessage can't contains a function attr
    params.listener = undefined;     //postMessage can't contains a function attr

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
    var callback = callbackMap[key];
    if(typeof callback === "function"){
        callback(resp.data.resp);
    }

    //delete callbackMap[key];

});


module.exports = openExtension;
