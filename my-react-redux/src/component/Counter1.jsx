import React from "react"
import { Component } from "react"
// import { bindActionCreators } from "../redux"
// import store from "../store"
import actionCreators from "../store/actionCreators/counter1"
import { connect } from "../react-redux"

// const boundActionCreators = bindActionCreators(actionCreators, store.dispatch)

class Counter1 extends Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     number: store.getState().counter1.number
  //   }
  // }

  // componentDidMount() {
  //   store.subscribe(() => {
  //     this.setState({
  //       number: store.getState().counter1.number
  //     })
  //   })
  // }

  render() {
    return (
      <div>
        <p>{this.props.number}</p>
        <button onClick={this.props.add1}>+</button>
        <button onClick={this.props.miuns1}>-</button>
        <button onClick={this.props.thunkADD}>thunkADD</button>
        <button onClick={this.props.promiseADD}>promiseADD</button>
      </div>
    )
  }
}

// 把仓库中的状态映射为组件的属性对象 仓库到组件的输出
const mapStateToProps = (state) => state.counter1
export default connect(
  mapStateToProps,
  // mapDispatchToProps
  actionCreators // 在组件里派发动作
)(Counter1)
