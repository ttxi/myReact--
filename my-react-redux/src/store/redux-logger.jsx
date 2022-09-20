function logger({ getState, dispatch }) {
  return function (next) {
    // 此方法就是改造后的dispatch方法
    return function (action) {
      console.log("老状态", getState())
      next(action) // 调用原始的diapatch 方法， 传入动作action
      console.log("新状态", getState())
      return action
    }
  }
}

export default logger