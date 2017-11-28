import { Socket } from 'net'
import { AnyAction } from 'redux'

export interface ISocket extends Socket {
  sendMessage: (data: AnyAction) => void
}

/**
 * An object composed by strings or other nested StringObjects
 */
export type StringObject = { [key: string]: string | StringObject | Object }

export interface IRoutes {
  [key: string]: IRoute | IMiddleware
}

export type IMiddleware = (req, res, next) => void

export interface IRoute {
  id:   string
  path: string
  url:  string
  name: string
  repo: string
}

export interface IStore {
  functions: {
    [key: string]: IRoute 
  }
}

export type IFunctionAction = { 
  type: string, 
  payload: IFunctioPayload
}

export interface IFunctioPayload extends IRoute {
  changes: IFunctioPayload

  [key: string]: any
}