import { ADD2, MINUS2 } from "../action-types"
function add2() {
  return { type: ADD2 }
}

function miuns2() {
  return { type: MINUS2 }
}

const actionCreators = { add2, miuns2 }

export default actionCreators
