function* fn() {
  console.log("start")
  yield { type: "PUT", action: { type: "ADD" } }
  yield new Promise((resolve) => setTimeout(resolve, 1000))
  yield { type: "PUT", action: { type: "MINUS" } }
}

function runSaga(saga) {
  const it = saga()
  function next() {
    const { done, value: effect } = it.next()
    if (!done) {
      if (effect.type === "PUT") {
        console.log(`向仓库派发一个动作 ${JSON.stringify(effect.action)}`)
        next()
      } else if (effect instanceof Promise) {
        effect.then(next)
      }else{
        next()
      }
    }
  }
  next()
}

runSaga(fn)
