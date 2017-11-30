import 'isomorphic-fetch'
import fetch from 'fetch-mock'
import * as HTTPMethods from '../src/constants/http-methods'
import fetchAdapter from '../src/index'

fetch.mock('*', () => ({}))

describe('fetch adapter', () => {
  it('must return an object with both execute and abort functions, as well as the request instance', () => {
    const adapter = fetchAdapter('http://localhost', HTTPMethods.GET)
    expect(adapter.execute).toBeInstanceOf(Function)
    expect(adapter.abort).toBeInstanceOf(Function)
    expect(adapter.instance).toBeInstanceOf(Request)
  })

  it('must return a HEAD request when supplied a HEAD method', () => {
    const { instance } = fetchAdapter('http://localhost', HTTPMethods.HEAD)
    expect(instance).toHaveProperty('method', HTTPMethods.HEAD)
  })

  it('must return a DELETE request when supplied a DELETE method', () => {
    const { instance } = fetchAdapter('http://localhost', HTTPMethods.DELETE)
    expect(instance).toHaveProperty('method', HTTPMethods.DELETE)
  })

  it('must return a GET request when supplied a GET method', () => {
    const { instance } = fetchAdapter('http://localhost', HTTPMethods.GET)
    expect(instance).toHaveProperty('method', HTTPMethods.GET)
  })

  it('must return a PATCH request when supplied a PATCH method', () => {
    const { instance } = fetchAdapter('http://localhost', HTTPMethods.PATCH)
    expect(instance).toHaveProperty('method', HTTPMethods.PATCH)
  })

  it('must return a POST request when supplied a POST method', () => {
    const { instance } = fetchAdapter('http://localhost', HTTPMethods.POST)
    expect(instance).toHaveProperty('method', HTTPMethods.POST)
  })

  it('must return a PUT request when supplied a PUT method', () => {
    const { instance } = fetchAdapter('http://localhost', HTTPMethods.PUT)
    expect(instance).toHaveProperty('method', HTTPMethods.PUT)
  })

  it('must throw an error when supplied an invalid HTTP method', () => {
    const invalid = () => fetchAdapter('http://localhost', 'abc')
    expect(invalid).toThrow(/Unsupported HTTP method/)
  })

  describe('execute', () => {
    beforeEach(() => fetch.reset())

    it('calls the global fetch', () => {
      const { execute } = fetchAdapter('', HTTPMethods.GET)
      const cb = jest.fn()
      execute(cb)
      expect(fetch.called()).toBe(true)
    })

    it('receives a callback which is called after performing the request', (done) => {
      const { execute } = fetchAdapter('', HTTPMethods.GET)
      const cb = jest.fn(() => {
        expect(fetch.called()).toBe(true)
        done()
      })
      execute(cb)
    })

    it('it passes an error (if any), as well as the response (status, body, text, headers)', (done) => {
      const { execute } = fetchAdapter('', HTTPMethods.GET)
      const cb = jest.fn((err, status, body, text, headers) => {
        expect(err).toBeUndefined()
        expect(status).toBe(200)
        expect(body).toEqual({})
        expect(text).toBe('{}')
        expect(headers).toEqual({})
        done()
      })
      execute(cb)
    })
  })
})
