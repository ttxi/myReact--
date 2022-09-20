
export default function combineReducers(reducers) {
  return function combinaction(state = {}, action) {
    let nextState = {}
    for (const key in reducers) {
      let nextStateForKey = state[key]
      let reducerForKey = reducers[key]
      nextState[key] = reducerForKey(nextStateForKey, action)
    }
    return nextState
  }
}