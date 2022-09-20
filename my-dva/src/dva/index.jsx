import React from "react"
import ReactDOM from "react-dom"
import { connect, Provider } from "react-redux"
import { createStore, applyMiddleware, combineReducers } from "redux"
import prefixNameSpace from "./prefixNameSpace"
import createSagaMiddleware from "redux-saga"
import * as sagaEffects from "redux-saga/effects"

function dva() {
  const app = {
    _models: [],
    model,
    _router: null,
    router,
    start
  }

  const initialReducers = {}

  function model(m) {
    const prefixModel = prefixNameSpace(m)
    app._models.push(prefixModel)
  }

  function router(router) {
    app._router = router
  }

  function start(selector) {
    for (const m of app._models) {
      initialReducers[m.namespace] = getReducers(m)
    }
    const rootReducer = createReducer()
    const sagas = getSagas(app)
    const sagaMiddleware = createSagaMiddleware()
    const store = applyMiddleware(sagaMiddleware)(createStore)(rootReducer)
    sagas.forEach((saga) => sagaMiddleware.run(saga))
    ReactDOM.render(
      <Provider store={store}>{app._router()}</Provider>,
      document.querySelector(selector)
    )
  }
  function getSagas(app) {
    const sagas = []
    for (const model of app._models) {
      sagas.push(getSaga(model))
    }
    return sagas
  }
  function createReducer() {
    return combineReducers(initialReducers)
  }

  return app
}

function getSaga(m) {
  const { effects } = m
  return function* () {
    for (const key in effects) {
      yield sagaEffects.takeEvery(key, function* (action) {
        yield effects[key](action, {
          ...sagaEffects,
          put: (action) =>
            sagaEffects.put({
              ...action,
              type: prefixType(action.type, m.namespace)
            })
        })
      })
    }
  }
}

function prefixType(type, namespace) {
  if (type.indexOf("/") === -1) {
    return `${namespace}/${type}`
  } else {
    console.warn("警告")
    return type
  }
}

function getReducers(m) {
  const { reducers, state: initialState } = m
  return (state = initialState, action) => {
    let reducer = reducers[action.type]
    if (reducer) {
      return reducer(state, action)
    }
    return state
  }
}

export default dva

export { connect }
