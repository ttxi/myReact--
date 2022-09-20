import React from "react"
import { bindActionCreators } from "../redux"
import ReactReduxContext from "./ReactReduxContext"

/**
 * 连接组件和仓库
 * @param {*} mapStateToProps 把仓库中的状态应设为组件的属性
 * @param {*} mapDispatchToProps
 */
function connect(mapStateToProps, mapDispatchToProps) {
  return function (OldComponent) {
    return class extends React.Component {
      static contextType = ReactReduxContext
      constructor(props, context) {
        super(props)
        
        const { store } = context
        const { getState, subscribe, dispatch } = store
        this.state = mapStateToProps(getState())
        this.unsubscribe = subscribe(() => {
          this.setState(mapStateToProps(getState()))
        })

        let dispatchProps
        if (typeof mapDispatchToProps === "function") {
          dispatchProps = mapDispatchToProps(dispatch)
        } else {
          dispatchProps = bindActionCreators(mapDispatchToProps, dispatch)
        }
        this.dispatchProps = dispatchProps
      }

      componentWillUnmount() {
        this.unsubscribe()
      }

      render() {
        return (
          <OldComponent
            {...this.props}
            {...this.state}
            {...this.dispatchProps}
          />
        )
      }
    }
  }
}

export default connect
