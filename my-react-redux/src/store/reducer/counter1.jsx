import { ADD1, MINUS1 } from "../action-types"

const initialState = { number: 0 }

function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD1:
      return { number: state.number + 1 }
      break
    case MINUS1:
      return { number: state.number - 1 }

    default:
      return state
      break
  }
}

export default reducer
