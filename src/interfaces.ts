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

export type IHandler = (socket: ISocket, data: ISocketData) => Promise<any>

export interface IHandlers {
  [key: string]: IHandler[]
}

export interface IFunction {
  path: string
  id: string
  url: string
  name: string
}