import { createStore, applyMiddleware } from "../redux"
import combinedReducer from "./reducer"

import promise from "./redux-promise"
import thunk from "./redux-thunk"
import logger from "./redux-logger"

// 写一个真正的日志中间件 ，中间件的格式是固定的

const store = applyMiddleware(promise, logger, thunk)(createStore)(
  combinedReducer
)

// const oldDispatch = store.dispatch
// 实现异步操作
// store.dispatch = function (action) {
//   setTimeout(() => {
//     oldDispatch(action)
//   }, 1000)
// }

// 还可以实现打印日志
// store.dispatch = (action) => {
//   console.log("prev state", store.getState())
//   oldDispatch(action)
//   console.log("next state", store.getState())
// }

export default store
