import { IFunctionAction } from '../interfaces'
import { cloneFunction, installFunction, removeFunction }   from '../manager'
import { createHash }      from 'crypto'
import { removeKeys }      from '../utils'
import { join }            from 'path'
import db                  from '../db'
import { clone, install, error, success } from '../actions/functions'

export default (state, action: IFunctionAction) => {
  switch(action.type) {
    case 'ADD_FUNCTION': {
      const { url, repo, name } = action.payload

      /** Generate the id from a reproducible md5 hash */
      const id = createHash('md5').update(url).digest('hex')

      /** Generate the function's path */
      const path = join(process.cwd(), 'functions', id)

      const data = {
        id, 
        url, 
        name, 
        path, 
        repo,
        status: 'CLONING'
      }

      cloneFunction(id, repo)
        .then(done => db.dispatch(install(id)))
        .catch(err => db.dispatch(error(id, err)))

      return {
        ...state,
        functions: {
          ...state.functions,
          [id]: data
        }
      }
    }

    case 'INSTALL_FUNCTION': {
      const { id } = action.payload
      const path = join(process.cwd(), 'functions', id)

      installFunction([ 'install', '--json' ], { cwd: path }, db.dispatch)
        .then(done => db.dispatch(success(id)))
        .catch(err => db.dispatch(error(id, err)))

      return {
        ...state,
        functions: {
          ...state.functions,
          [id]: {
            ...state.functions[id],
            status: 'INSTALLING'
          }
        }
      }
    }

    case 'SUCCESS_FUNCTION': {
      const { id } = action.payload

      return {
        ...state,
        functions: {
          ...state.functions,
          [id]: {
            ...state.functions[id],
            status: 'DONE'
          }
        }
      } 
    }
    
    case 'REMOVE_FUNCTION': {
      const { id } = action.payload

      removeFunction(id)
        .then(done => db.dispatch({ type: 'REMOVED_FUNCTION', payload: { id } }))
        .catch(err => error(id, err))

      return {
        ...state,
        functions: {
          ...state.functions,
          [id]: {
            ...state.functions[id],
            status: 'REMOVING'
          }
        }
      } 
    }

    case 'REMOVED_FUNCTION': {
      return {
        ...state,
        functions: Object
          .keys(state.functions)
          .reduce(removeKeys(state.functions, action.payload.id), {})
      }
    }

    case 'EDIT_FUNCTION': {
      const { id } = action.payload

      /**
        /** Remove the current function /
        db.dispatch({
          type: 'REMOVE_FUNCTION',
          payload: { id }
        })

        db.dispatch({
          type: 'ADD_FUNCTION',
          payload: {
            ...state.functions[id], /** The data from the old function /
            ...action.payload.changes
          }
      })
      */

      return {
        ...state,
        functions: {
          ...state.functions,
          [id]: {
            ...state.functions[id],
            status: 'CHANGING'
          }
        }
      }
    }

    default: {
      return state || null
    }
  }
}