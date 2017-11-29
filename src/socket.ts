import { createServer } from 'net'
import * as jsonSocket  from 'json-socket'
import { SOCKET_PORT }  from './constants'
import { ISocket }      from './interfaces'
import db               from './db'

export const connections: ISocket[] = []

/**
 * Handles the connection of a socket. 
 * Starts to listen for any input.
 * 
 * @param socket The new connected socket
 */
export const handler = (socket: ISocket) => {
  socket = new jsonSocket(socket)

  connections.push(socket)

  socket.on('message', db.dispatch)
  socket.on('close', e => connections.splice(connections.indexOf(socket), 1))
}

/** 
 * The socket server that enables connection between 
 * the backend and any other socket stream 
 */
export const openSocket = (callback: Function) => createServer(handler).listen(SOCKET_PORT, callback)