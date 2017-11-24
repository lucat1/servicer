import { createServer, Socket } from 'net'
import * as jsonSocket from 'json-socket'
import { SOCKET_PORT } from './constants'
import { ISocketData, ISocket, IHandlers, IHandler } from './interfaces'

/** An object of handlers to manage the socket's messages */
export const handlers: IHandlers = {}

/**
 * Handles the connection of a socket. 
 * Starts to listen for any input.
 * 
 * @param socket The new connected socket
 */
export const handler = (socket: ISocket) => {
  socket = new jsonSocket(socket)

  socket.on('message', data => handleMessage(socket, data))
}

/**
 * 
 * @param data The message's data
 */
export const handleMessage = async (socket: ISocket, data: ISocketData) => {
  if(<Object>handlers.hasOwnProperty(data.type)) {

    await Promise.all(handlers[data.type].map(handler => handler(socket, data)))

  } else {
    socket.sendMessage({ 
      type: 'error', 
      action: data.action,
      message: 'The action you requested wasn\'t found.',
      payload: new Error('The action you requested wasn\'t found.')
    })
  }
}

/**
 * Adds an handler for a certain type of action
 * 
 * @param type    The action's type
 * @param handler The funtion that handles the event
 */
export const registerHandler = (type: string, handler: IHandler) => {
  if (!<Object>handlers.hasOwnProperty(type)) {
    /** Define the type handler if it hasn't already  */
    handlers[type] = new Array()
  }

  handlers[type].push(handler)
}

/** 
 * The socket server that enables connection between 
 * the backend and any other socket stream 
 */
export const openSocket = (callback: Function) => createServer(handler).listen(SOCKET_PORT, callback)