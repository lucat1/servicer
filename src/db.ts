import { createStore, applyMiddleware, combineReducers } from 'redux'
import { readFile as _readFile, writeFile as _writeFile } from 'fs'
import { reducer as polyfillReducers, createMiddleware, createLoader } from 'redux-storage'

/** Storage helpers */
import { join }  from 'path'
import * as pify from 'pify'

/** Reducers */
import FunctionsReducer from './reducers/functions'

/** Middlewares and helpers */
import debounceStorage   from 'redux-storage-decorator-debounce'
import LoggerMiddleware  from './middlewares/logger'
import SocketMiddleware  from './middlewares/socket'

const readFile = pify(_readFile)
const writeFile = pify(_writeFile)
const cachePath = join(process.cwd(), 'data.json')
const reducers = combineReducers({
  functions: FunctionsReducer
})

const reducer = polyfillReducers(reducers)
const engine  = debounceStorage({
  async load() {
    const result = await readFile(cachePath)

    return JSON.parse(result)
  },
  save(state) {
    const keys = JSON.stringify(state).match(/[^\\]":/g).length
    const json = JSON.stringify(state, null, keys <= 200 ? 2 : 0)

    console.log('action#STATE_SAVED', state)

    return writeFile(cachePath, json)
  }
}, 1000)
const StoreMiddleware = createMiddleware(engine)

const createStoreWithMiddlewares = applyMiddleware(
  LoggerMiddleware,
  SocketMiddleware,
  StoreMiddleware
)(createStore)

const store = createStoreWithMiddlewares(reducer)
const loader = createLoader(engine)

loader(store)
  .then(newState => console.log('action#STATE_LOADED', newState))
  .catch(err => console.error('action#STATE_LOAD_ERROR', '\n', err))


export default store