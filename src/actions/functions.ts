import { AnyAction } from 'redux'

export const clone = (id: string, repo: string): AnyAction => ({
  type: 'CLONE_FUNCTION',
  payload: {
    id,
    repo
  }
})

export const install = (id: string): AnyAction => ({
  type: 'INSTALL_FUNCTION',
  payload: { id }
})

export const error = (id: string, error: any): AnyAction => ({
  type: 'CLONE_FUNCTION',
  payload: { id, error }
})

export const success = (id: string): AnyAction => ({
  type: 'SUCCESS_FUNCTION',
  payload: { id }
})

