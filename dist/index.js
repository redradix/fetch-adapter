"use strict";

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
    var resStatus, resText, resBody, resHeaders;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // REVIEW: Shall we throw an error when status < 200 || status >= 300 ?
            resStatus = response.status;
            _context.next = 3;
            return response.text();

          case 3:
            resText = _context.sent;
            resBody = JSON.parse(resText);
            resHeaders = {};

            response.headers.forEach(function (v, h) {
              return resHeaders[h] = v;
            });

            return _context.abrupt("return", { resStatus: resStatus, resBody: resBody, resText: resText, resHeaders: resHeaders });

          case 8:
          case "end":
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


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchNetworkAdapter = function fetchNetworkAdapter(url, method) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      body = _ref2.body,
      headers = _ref2.headers,
      credentials = _ref2.credentials;

  var options = { method: method, body: body, headers: headers, credentials: credentials };
  var request = window.fetch.bind(window.fetch, url, options);

  var execute = function execute(cb) {
    return request().then(buildResponse, cb) // REVIEW: Should we move cb to the 2nd then?
    .then(function (_ref3) {
      var resStatus = _ref3.resStatus,
          resBody = _ref3.resBody,
          resText = _ref3.resText,
          resHeaders = _ref3.resHeaders;
      return cb(void 0, resStatus, resBody, resText, resHeaders);
    });
  };

  // TODO: Add some hack to prevent callback from being called after abortion
  var abort = function abort() {
    return void 0;
  };

  return {
    abort: abort,
    execute: execute,
    instance: void 0 // There is no way to access the request instance for now
  };
};

exports.default = fetchNetworkAdapter;