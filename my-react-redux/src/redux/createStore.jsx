export default function createStore(reducer) {
  let state
  const listeners = []

  function getState() {
    return state
  }

  function subscribe(listener) {
    listeners.push(listener)
    return function unsubscribe() {
      var index = listener.indexOf(listener)
      listener.splice(index, 1)
    }
  }

  // 向仓库派发动作
  function dispatch(action) {
    state = reducer(state, action)
    listeners.forEach((listener) => listener())
  }

  dispatch({})

  return {
    getState,
    subscribe,
    dispatch
  }
}
