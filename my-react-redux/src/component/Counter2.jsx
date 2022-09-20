import { Component } from "react"
import actionCreators from "../store/actionCreators/counter2"
import { useSelector, useDispatch, useBoundDispatch } from "../react-redux"

function Counter2() {
  const counter2 = useSelector((state) => state.counter2)
  // const dispatch = useDispatch()

  const { add2, miuns2 } = useBoundDispatch(actionCreators)

  return (
    <div>
      <p>{counter2.number}</p>
      <button onClick={add2}>+</button>
      <button onClick={miuns2}>-</button>
    </div>
  )
}

export default Counter2
