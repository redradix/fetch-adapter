import { stringify } from 'qs'

/**
 * Fetch network adapter for redux-query
 * @see https://github.com/whatwg/fetch
 * @see https://github.com/amplitude/redux-query/
 * @version 0.2.0
 * @author Aaron Contreras <aaron@redradix.com>
 */

async function buildResponse(response) {
  const error = response.ok ? void 0 : new Error()
  const resStatus = response.status
  const resText = await response.text()
  const resBody = JSON.parse(resText)
  const resHeaders = {}
  response.headers.forEach((v, h) => resHeaders[h] = v)

  return [ error, resStatus, resBody, resText, resHeaders ]
}

/**
 * A BodyInit, as defined by the Fetch standard.
 * @see [Body Mixin]{@link https://fetch.spec.whatwg.org/#body-mixin}
 * @typedef {Blob|BufferSource|FormData|URLSearchParams|USVString} BodyInit
 */

/**
 * prepareBody - Prepare body to be consumable by both Request and window.fetch
 * This function accepts either a supported body entity, in which case it is
 * returned as is, or an object, which will be stringified and returned
 *
 * @param {BodyInit|object} body
 * @return {BodyInit} Either body, or a stringified version of the body object
 */
function prepareBody(body) {
  if (typeof body === 'string' || // USVString
      body instanceof Blob || // Blob
      body instanceof FormData || // FormData
      body instanceof URLSearchParams || // URLSearchParams
      // BufferSource
      body instanceof ArrayBuffer || body instanceof Int8Array ||
      body instanceof Uint8Array || body instanceof Uint8ClampedArray ||
      body instanceof Int16Array || body instanceof Uint16Array ||
      body instanceof Int32Array || body instanceof Uint32Array ||
      body instanceof Float32Array || body instanceof Float64Array) {
    return body
  }
  return JSON.stringify(body)
}

// REVIEW: Make this a factory accepting options to deep merge.
const fetchNetworkAdapter = (url, method, { body, headers, credentials } = {}) => {
  let aborted = false
  const abortionMock = (cb) => (...args) => aborted ? void 0 : cb(...args)

  const options = { method, headers, credentials }

  if (body) {
    if (method === 'GET' || method === 'HEAD') {
      url = `${url}${url.includes('?') ? '&' : '?'}${stringify(body)}`
    } else {
      options.body = prepareBody(body)
    }
  }

  const request = new Request(url, options)

  const execute = (cb) =>
    fetch(request)
    .then(abortionMock(buildResponse))
    // NOTE: Give a default value of [] to prevent from breaking when aborted
    .then((args = []) => abortionMock(cb)(...args), abortionMock(cb))

  const abort = () => (aborted = true)

  return {
    abort,
    execute,
    instance: request
  }
}

export default fetchNetworkAdapter
