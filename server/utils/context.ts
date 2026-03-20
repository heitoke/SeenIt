import { AsyncLocalStorage } from 'async_hooks'

export const asyncLocalStorage = new AsyncLocalStorage()

export function getContext() {
  return asyncLocalStorage.getStore() || {}
}