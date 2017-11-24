import { createServer, IncomingMessage, ServerResponse } from 'http'
import { parse } from 'url'
import { json } from 'body-parser'
import * as pify from 'pify'
import { API_PORT } from './constants'
import db from './db'
import { benchRunner } from './spawner'
import { IFunction } from './interfaces'
 
/**
 * Handles every request to the api port, finding the
 * correct url action, executing it and then call others if the
 * request executed next()
 * 
 * @param req The server/client request
 * @param res The server/client response
 */
export const listener = async (req: IncomingMessage, res: ServerResponse) => {
  const results = Object.keys(<{ [key:string]: IFunction }>db['functions'])
    .filter(id => parse(req.url).pathname == db['functions'][id]['url'])

  if(req.method == 'POST') {
    results.unshift(json())
  }

  if(!results.length) {
    res.writeHead(404, { 'Content-Type': 'text/json' })
    res.write(JSON.stringify({ code: 404 }, null, 2))
    res.end()
  }

  results.reduce(
    (prev, id) => {
      const route = typeof id == 'function' ? id : db['functions'][id]
      return runRoute(route, req, res, prev)
    }, 
    Promise.resolve(true)
  )
}

export const runRoute = async (route, req, res, previousValue) => {
  if(await previousValue) {
    let returnValue = false
 
    const next = decision => returnValue = true

    /** Middleware */
    if (typeof route == 'function') {
      await pify(route)(req, res)

      returnValue = true
    } else {
      /** Normal route */
      await Promise.resolve(benchRunner(route)(req, res, next))
    }

    return returnValue
  } else return false
}

export const openApi = (callback: Function) => createServer(listener).listen(API_PORT, callback)