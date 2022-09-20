import React from "react"
import ReactDOM from "react-dom/client"
// import App from "./App"
import Counter1 from "./component/Counter1"
import Counter2 from "./component/Counter2"

import { Provider } from "./react-redux"
import store from './store'

const root = ReactDOM.createRoot(document.getElementById("root"))

// root.render(<App />)
root.render(
  <Provider store={store}>
    <Counter1></Counter1>
    <hr />
    <Counter2></Counter2>
  </Provider>
)
