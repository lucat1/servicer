import { AnyAction, Store, Dispatch } from 'redux'

export default (store: Store<any>) => 
  (next: Dispatch<any>) => 
  (action: any) => {
    const { payload: _payload, type } = action
    const payload = _payload ? _payload : {}

    switch(type) {
      case 'INSTALLATION_PROGRESS': 
          /** Ignore, this spams WAY too much in the console */
      break

      case 'ADD_FUNCTION':
        console.log(`actions#${type}('NO_ID') ${payload.url} -> ${payload.repo}`)
      break

      case 'REDUX_STORAGE_LOAD':
        console.log('actions#STATE_LOAD([Object])')
      break


      case 'REDUX_STORAGE_SAVE':
        console.log('actions#STATE_SAVE([Object])')
      break

      default:
        if(payload.error) console.warn(payload.error)
        console.log(`actions#${type}(${payload.id || payload.error || 'NO_ID'})`)
      break

    }

    return next(action)
  }