import { AnyAction, Store, Dispatch } from 'redux'
import { connections } from '../socket'

export default (store: Store<any>) =>
  (next: Dispatch<any>) =>
    (action: any) => {
      connections.forEach(socket => socket.sendMessage(action))

      return next(action)
    }