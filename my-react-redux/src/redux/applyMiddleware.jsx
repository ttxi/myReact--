import compose from "./compose"

function applyMiddleware(...middlewares) {
  return function (createStore) {
    return function (reducer, preloadedState) {
      const store = createStore(reducer, preloadedState)

      // 这里为什么不把dispatch 直接赋值给dispatch  因为undeinfed
      let dispatch
      let middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action)
      }
      // dispatch = middleware(middlewareAPI)(store.dispatch)

      let chain = middlewares.map((middleware) => middleware(middlewareAPI))
      dispatch = compose(...chain)(store.dispatch)

      return {
        ...store,
        dispatch
      }
    }
  }
}
export default applyMiddleware
