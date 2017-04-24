import { stringify } from 'qs'

/**
 * Fetch network adapter for redux-query
 * @see https://github.com/whatwg/fetch
 * @see https://github.com/amplitude/redux-query/
 * @version 0.1.0
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

// REVIEW: Make this a factory accepting options to deep merge.
const fetchNetworkAdapter = (url, method, { body, headers, credentials } = {}) => {
  let aborted = false
  const abortionMock = (cb) => (...args) => aborted ? void 0 : cb(...args)

  const options = { method, body, headers, credentials }

  if (method === 'GET' && body) {
    url = `${url}${url.includes('?') ? '&' : '?'}${stringify(body)}`
  }

  const request = new Request(url, options)

  const execute = (cb) =>
    window.fetch(request)
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
