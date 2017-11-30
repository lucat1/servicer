import * as rd from 'readline'
import db from './db'
import { openSocket } from './socket'
import { openApi } from './http'
import { API_PORT, SOCKET_PORT, ADDRESS } from './constants'

openSocket(any => console.log('The socket is listening on port socket://%s:%s', ADDRESS, SOCKET_PORT))
openApi(any => console.log('The https api is listening on port http://%s:%s', ADDRESS, API_PORT))

rd.createInterface(process.stdin, process.stdout)
  .on('line', (input: string) => input == 'db' && console.log(JSON.stringify(db.getState(), null, 2)))
  .on('line', (input: string) => input == 'clear' && process.stdout.write('\x1B[2J'))