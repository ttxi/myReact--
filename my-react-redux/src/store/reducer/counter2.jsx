import { ADD2, MINUS2 } from "../action-types"
const initialState = { number: 0 }
function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD2:
      return { number: state.number + 1 }
      break
    case MINUS2:
      return { number: state.number - 1 }
      break

    default:
      return state
      break
  }
}

export default reducer
