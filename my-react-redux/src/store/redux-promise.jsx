function promise(/* middlewareAPI */ { getState, dispatch }) {
  // let middlewareAPI = {
  //   getState: store.getState,
  //   dispatch: (action) => dispatch(action)
  // }
  return function (next) {
    // next = store.dispatch
    return function (action) {
      if (action.then && typeof action.then === "function") {
        action.then(dispatch)
      } else {
        next(action)
      }
    }
  }
}

export default promise
