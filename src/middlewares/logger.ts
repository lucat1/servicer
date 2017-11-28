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

      default:
        console.log(`actions#${type}(${payload.id || 'NO_ID'})`)
      break

    }

    return next(action)
  }