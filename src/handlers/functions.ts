import { writeFileSync } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'
import * as _clone from 'git-clone'
import * as pify from 'pify'
import { spawn } from 'child_process'
import { StringObject } from '../interfaces'
import { registerHandler } from '../socket'
import db,{ save } from '../db'

const clone = pify(_clone)

registerHandler('request', async (socket, { payload, action }) => {
  switch(action) {
    case 'ADD_FUNCTION':
      const { url, name, repoUrl } = <StringObject>payload
      const id   = createHash('md5').update(<string>url).digest('hex')
      const path = join(process.cwd(), 'functions', id)
      
      await clone(repoUrl, path)
      const installer = spawn('npm', ['install'], { cwd: path })

      const data = { url, name, path, id, repoUrl }

      db['functions'][id] = data

      socket.sendMessage({ 
        type: 'success', 
        action, 
        payload: data,
        message: 'Created action with uuid(' + id + ')' 
      })

      save()
    break

    case 'REMOVE_FUNCTION':

    break

    case 'EDIT_FUNCTION':

      break
  }
})