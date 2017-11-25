import { Socket } from 'net'

export interface ISocket extends Socket {
  sendMessage: (data: ISocketData) => void
}

/**
 * An object composed by strings or other nested StringObjects
 */
export type StringObject = { [key: string]: string | StringObject | Object }

/**
 * The cutom jsonSocket data
 */
export interface ISocketData {
  type: 'info' | 'result' | 'error' | string
  action: 'ADD_FUNCTION' | 'REMOVE_FUNCTION' | 'EDIT_FUNCTION' | string
  message?: string
  payload: StringObject | any
}

export type ISocketHandler = (socket: ISocket, data: ISocketData) => Promise<any>

export interface IHandlers {
  [key: string]: ISocketHandler[]
}

export interface IRoutes {
  [key: string]: IRoute | IMiddleware
}

export type IMiddleware = (req, res, next) => void

export interface IRoute {
  path: string
  id: string
  url: string
  name: string
}