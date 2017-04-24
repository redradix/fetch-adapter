'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Fetch network adapter for redux-query
 * @see https://github.com/whatwg/fetch
 * @see https://github.com/amplitude/redux-query/
 * @version 0.1.0
 * @author Aaron Contreras <aaron@redradix.com>
 */

var buildResponse = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(response) {
    var error, resStatus, resText, resBody, resHeaders;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            error = response.ok ? void 0 : new Error();
            resStatus = response.status;
            _context.next = 4;
            return response.text();

          case 4:
            resText = _context.sent;
            resBody = JSON.parse(resText);
            resHeaders = {};

            response.headers.forEach(function (v, h) {
              return resHeaders[h] = v;
            });

            return _context.abrupt('return', [error, resStatus, resBody, resText, resHeaders]);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function buildResponse(_x) {
    return _ref.apply(this, arguments);
  };
}();

// REVIEW: Make this a factory accepting options to deep merge.


var _qs = require('qs');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchNetworkAdapter = function fetchNetworkAdapter(url, method) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      body = _ref2.body,
      headers = _ref2.headers,
      credentials = _ref2.credentials;

  var aborted = false;
  var abortionMock = function abortionMock(cb) {
    return function () {
      return aborted ? void 0 : cb.apply(undefined, arguments);
    };
  };

  var options = { method: method, body: body, headers: headers, credentials: credentials };

  if (method === 'GET' && body) {
    url = '' + url + (url.includes('?') ? '&' : '?') + (0, _qs.stringify)(body);
  }

  var request = new Request(url, options);

  var execute = function execute(cb) {
    return window.fetch(request).then(abortionMock(buildResponse))
    // NOTE: Give a default value of [] to prevent from breaking when aborted
    .then(function () {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return abortionMock(cb).apply(undefined, _toConsumableArray(args));
    }, abortionMock(cb));
  };

  var abort = function abort() {
    return aborted = true;
  };

  return {
    abort: abort,
    execute: execute,
    instance: request
  };
};

exports.default = fetchNetworkAdapter;