function compose(...funcs) {
  return function (args) {
    for (let i = funcs.length - 1; i >= 0; i--) {
      args = funcs[i](args)
    }
    return args
  }
}

const promise = (next) => (action) => {
  console.log("promise")
  next(action)
}
const thunk = (next) => (action) => {
  console.log("thunk")
  next(action)
}
const logger = (next) => (action) => {
  console.log("logger")
  next(action)
}

const dispatch = () => {
  console.log("dispatch")
}

const fn1 = compose(promise, thunk, logger)
const fn = fn1(dispatch)
fn({ type: "ADD" })
