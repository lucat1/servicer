import * as pify from 'pify'
import { parse } from 'url'
import { API_PORT }   from 'src/constants'
import { NotFound }   from 'src/404'
import { getHandler } from 'src/spawner'
import { Benchmark }  from 'src/bench'
import {
  createServer,
  IncomingMessage,
  ServerResponse
} from 'http'
import { 
  IRoute, 
  IRoutes, 
  IMiddleware 
} from 'src/interfaces'
import db from 'src/db'

/**
 * Checks if a function in the database matches a given url
 * 
 * @param url The url to be matched
 */
export const matches = url => id => 
  url == db['functions'][id]['url']

/**
 * Flattens an array, recursively, using es6 reducers
 * 
 * @param flat The previous result
 * @param toFlatten The new array to be merged
 */
export const flatten = (flat: IRoute[], toFlatten?: IRoutes) => 
  flat.concat(toFlatten instanceof Array ? flatten(toFlatten) : toFlatten)

/** The looping index */
let i = -1

/**
 * Generates a looper that keeps executing middlewares
 * as long as they return the next call.
 * 
 * @param handlers The array of middlewares
 * @param req The server/client request
 * @param res The server/client response
 */
const loop = (handlers: IMiddleware[], req: IncomingMessage, res: ServerResponse) => 
  () => {
    i++

    if(handlers[i]) {
      handlers[i](req, res, loop(handlers, req, res))
    }
  }

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
  
  /** Reset the looping index on each request */
  i = -1

  /** Start the middleware looping */
  loop(handlers, req, res)

  console.info('Route', url, 'executed in', timer.elapsed() + 'ms')
}

export const openApi = (callback: Function) => createServer(Router).listen(API_PORT, callback)