"use strict";

var mainnetUrl = "https://pay.nebulas.io/api/mainnet/pay";
var testnetUrl = "https://pay.nebulas.io/api/pay";

var payUrl = function(debug) {
    debug = debug || false;
    if (debug) {
        return testnetUrl;
    } else {
        return mainnetUrl;
    }
};

var nanoScheme = function(debug) {
    debug = debug || false;
    if (debug) {
        return "openapp.NASnano.testnet";
    } else {
        return "openapp.NASnano";
    }
};

module.exports = {
    payUrl: payUrl,
    nanoScheme: nanoScheme,
    mainnetUrl: mainnetUrl,
    testnetUrl: testnetUrl
};