"use strict";

var get = function(url, body) {
    var obj = {
        url: url,
        method: "GET",
        body: body
    };
    return request(obj);
};

var post = function (url, body) {
    var obj = {
        url: url,
        method: "POST",
        body: body
    };
    return request(obj);
};
var request = function(obj) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(function(key) {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = function() { return reject(xhr.statusText); }
        xhr.send(obj.body);
    });
};

module.exports = {
    get: get,
    post: post,
    request: request
};