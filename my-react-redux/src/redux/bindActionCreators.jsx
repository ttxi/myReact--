function bindActionCreator(actionCreator, dispatch) {
  return (...args) => {
    dispatch(actionCreator.apply(null, args))
  }
}

export default function bindActionCreators(actionCreators, dispatch) {
  const boundActionCreators = {}

  for (const key in actionCreators) {
    const actionCreator = actionCreators[key]
    boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
  }

  return boundActionCreators
}

/* 
  actionCreator = 
  function add() {
    return { type: ADD }
  }
bindActionCreator
  {
    add:()=>{
      dispatch({ type: ADD })
    }
  }

*/
