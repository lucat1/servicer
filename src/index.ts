import * as rd from 'readline'
import db from './db'
import { openSocket } from './socket'
import { openApi } from './http'
import { API_PORT, SOCKET_PORT } from './constants'
import './handlers/load'

openSocket(any => console.log('The socket is listening on port', SOCKET_PORT))
openApi(any => console.log('The https api is listening on port', API_PORT))

rd.createInterface(process.stdin, process.stdout)
  .on('line', (input: string) => input == 'db' && console.log(JSON.stringify(db, null, 2)))
  .on('line', (input: string) => input == 'clear' && process.stdout.write('\x1B[2J'))