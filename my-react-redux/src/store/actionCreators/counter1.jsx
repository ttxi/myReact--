import { ADD1, MINUS1 } from "../action-types"
function add1() {
  return { type: ADD1 }
}

function miuns1() {
  return { type: MINUS1 }
}

function thunkADD() {
  return function (getState, dispatch) {
    setTimeout(() => {
      dispatch({ type: ADD1 })
    }, 1000)
  }
}

function promiseADD() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ type: ADD1 })
    }, 1000)
  })
}

const actionCreators = { add1, miuns1, thunkADD, promiseADD }

export default actionCreators
