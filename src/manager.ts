import { existsSync }          from 'fs'
import { spawn, SpawnOptions } from 'child_process'
import { NPM_INSTALL } from './constants'
import { NPM_CLIENT }  from './constants'
import { ISocket }     from './interfaces'
import { join }   from 'path'
import * as Clone from 'git-clone'
import * as rmraf from 'rimraf'
import * as pify  from 'pify'

/** Clone a git repository in a specified destination */
const clone = pify(Clone)
const rmrf  = pify(rmraf)

export const removeFunction = async (id) => {
  const path = join(process.cwd(), 'functions', id)

  /** Remove the function folder if it already exists */
  if (existsSync(path)) {
    await Promise.resolve(rmrf(path))
  }
}


export const cloneFunction = async (id, repo) => {
  const path = join(process.cwd(), 'functions', id)

  await removeFunction(id)

  /** Clone the git repo containing the function */
  await clone(repo, path)
}

export const installFunction = (args: string[], ops: SpawnOptions, dispatch?) => 
  new Promise((resolve, reject) => {
    const process = spawn(NPM_CLIENT, args, ops)

    process.stdout.on('data', handleData(dispatch))
    process.stderr.on('data', handleData(dispatch))

    process.on('exit', handleExit(dispatch, resolve))
  })

export const handleData = (dispatch) => data => {
  let __data = data

  try {
    data = JSON.parse(data.toString())
  } catch(e) {}

  dispatch({
    type: 'INSTALLATION_PROGRESS',
    payload: {
      data: __data,
      state: 'progress'
    }
  })
}

export const handleExit = (dispatch, res) => code => {
  dispatch({
    type: 'INSTALLATION_EXIT',
    payload: {
      code
    }
  })

  res()
}