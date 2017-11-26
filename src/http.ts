import { createServer, IncomingMessage, ServerResponse } from 'http'
import { parse } from 'url'
import * as pify from 'pify'
import { API_PORT } from './constants'
import { NotFound } from './404'
import db from './db'
import { getHandler } from './spawner'
import { Benchmark } from './bench'
import { IRoute, IRoutes, IMiddleware } from './interfaces'

export const matches = url => id => 
  url == db['functions'][id]['url']

export const flatten = (flat: IRoute[], toFlatten?: IRoutes) => 
  flat.concat(toFlatten instanceof Array ? flatten(toFlatten) : toFlatten)

/**
 * Handles every request to the api port, finding the
 * correct url action, executing it with middlewars with a
 * full express-like api, including next functions.
 * 
 * @param req The server/client request
 * @param res The server/client response
 */
export const Router = async (req: IncomingMessage, res: ServerResponse) => {
  const functions = <IRoutes>db['functions']
  const url       = parse(req.url).pathname
  const ids       = Object.keys(functions)
  const results   = ids.filter(matches(url)).map(id => functions[id])

  /** 404 handle case */
  if(!results.length) {
    const customHandler = functions[ids.find(matches('404'))]
    results.push(customHandler || NotFound)
  }

  const timer = new Benchmark()

  const handlers = results.map(getHandler).reduce(flatten, [])
  
  let i = -1
  const next = () => {
    i++
    handlers[i](req, res, next)
  }

  next()

  console.info('Route', url, 'executed in', timer.elapsed() + 'ms')
}

export const openApi = (callback: Function) => createServer(Router).listen(API_PORT, callback)