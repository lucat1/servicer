import { readFileSync, existsSync } from 'fs'
import { runInNewContext, createContext } from 'vm'
import { join } from 'path'
import { IRoute } from './interfaces'

export const getFunction = (route: IRoute) => {
  const _exports = require(route.path)
  const result = _exports.__esModule ? _exports.default : _exports

  return result
}

export const getHandler = route => typeof route == 'function' 
  ? route 
  : getFunction(route)