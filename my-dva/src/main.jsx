import React from "react"
import dva, { connect } from "./dva"
const app = dva()

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

app.model({
  namespace: "counter1", //
  state: {
    number: 0
  },
  reducers: {
    add(state, action) {
      return { number: state.number + 1 }
    }
  },
  effects: {
    *asyncAdd(action, { call, put }) {
      yield call(delay, 1000)
      yield put({ type: "counter1/add" })
    }
  }
})

function Counter1(props) {
  return (
    <div>
      <p>{props.number}</p>
      <button onClick={() => props.dispatch({ type: "counter1/add" })}>
        +
      </button>
      <button onClick={() => props.dispatch({ type: "counter1/asyncAdd" })}>
        +
      </button>
    </div>
  )
}
const ConnectCounter1 = connect((state) => state.counter1)(Counter1)

app.model({
  namespace: "counter2", //
  state: {
    number: 0
  },
  reducers: {
    add(state, action) {
      return { number: state.number + 1 }
    }
  }
})
function Counter2(props) {
  return (
    <div>
      <p>{props.number}</p>
      <button onClick={() => props.dispatch({ type: "counter2/add" })}>
        +
      </button>
    </div>
  )
}
const ConnectCounter2 = connect((state) => state.counter2)(Counter2)

app.router(() => (
  <>
    <ConnectCounter2 />
    <hr />
    <ConnectCounter1 />
  </>
))
app.start("#root")
