import { useLayoutEffect } from "react"
import { useRef } from "react"
import { useState } from "react"
import { useReducer } from "react"
import { useContext } from "react"

import ReactReduxContext from "../ReactReduxContext"

/**
 *
 * @param {*} selector (state) => state.counter2
 * @returns
 */
function useSelector(selector) {
  const { store } = useContext(ReactReduxContext)
  // const state = store.getState()
  // const lastSelectedState = useRef(null)

  // const selectedState = selector(state)

  // // 订阅仓库中的状态变化发生事件
  // const [, forceUpdate] = useReducer((x) => x + 1, 0)
  // useLayoutEffect(() => {
  //   store.subscribe(() => {
  //     let selectedState = selector(store.getState())
  //     if (!shallowRqual(selectedState, lastSelectedState.current)) {
  //       forceUpdate()
  //       lastSelectedState.current = selectedState
  //     }
  //   })
  // }, [])
  // return selectedState

  // react 18新添加的自定义hook
  const selectedField = useSyncExternalStore(store.subscribe, () =>
    selector(store.getState())
  )

  return selectedField
}

// 自己实现
function useSyncExternalStore(subscribe, getSnapShot) {
  const [state, setState] = useState(getSnapShot())
  useLayoutEffect(() => {
    subscribe(() => {
      setState(getSnapShot())
    })
  }, [])
  return state
}

function shallowRqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true
  }

  if (
    typeof obj1 != "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false
  }

  let keys1 = Object.keys(obj1)
  let keys2 = Object.keys(obj2)
  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key in keys1) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
      return false
    }
  }
  return true
}

export default useSelector
