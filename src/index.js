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
  const options = { method, body, headers, credentials }

  if (method === 'GET' && body) {
    url = `${url}${url.includes('?') ? '&' : '?'}${stringify(body)}`
  }

  const request = window.fetch.bind(window.fetch, url, options)

  const execute = (cb) =>
    request()
    .then(buildResponse)
    .then((args) => cb(...args), cb)

  // TODO: Add some hack to prevent callback from being called after abortion
  const abort = () => void 0

  return {
    abort,
    execute,
    instance: void 0 // There is no way to access the request instance for now
  }
}

export default fetchNetworkAdapter
