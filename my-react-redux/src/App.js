import React, { useEffect, useState } from "react"
import { createStore } from "./redux"

const initialState = { number: 0 }
const ADD = "ADD"
const MINUS = "MINUS"

function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD:
      return { number: state.number + 1 }
      break
    case MINUS:
      return { number: state.number - 1 }
      break

    default:
      return state
      break
  }
}

const store = createStore(reducer)

// const store = cre
function App() {
  const [, forceUpdate] = useState()

  useEffect(() => {
    console.log("componentDidMount")
    const unsubscribe = store.subscribe(() => {
      forceUpdate((update) => !update)
    })
    return unsubscribe
  }, [])
  const add = () => {
    store.dispatch({ type: ADD })
  }
  const minus = () => {
    store.dispatch({ type: MINUS })
  }

  return (
    <>
      <span>{store.getState().number}</span>
      <button onClick={add}>+</button>
      <button onClick={minus}>-</button>
    </>
  )
}

export default App

// 二分查找
function search(A, x) {
  let l = 0,
    r = A.length - 1,
    guess

  while (l <= r) {
    guess = Math.floor((l + r) / 2)
    if (A[guess] === x) {
      return guess
    } else if (A[guess] < x) {
      l = guess + 1
    } else {
      r = guess - 1
    }
  }
  return -1
}

const A = [0, 2, 5, 6, 8, 9, 10, 22, 33, 55]
console.log(search(A, 7))
