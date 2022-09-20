function add1(str) {
  return "1" + str
}
function add2(str) {
  return "2" + str
}
function add3(str) {
  return "3" + str
}

// function compose(...funcs) {
//   return function (args) {
//     for (let i = funcs.length - 1; i >= 0; i--) {
//       args = funcs[i](args)
//     }
//     return args
//   }
// }

// function compose(...funcs) {
//   return funcs.reduce((a, b) => (...args) => a(b(...args)))
// }
// add1(add2(add3()))

function compose(...funcs) {
  return funcs.reduce((a, b) => {
    console.log(a, b)
    return (...args) => a(b(...args))
  })
}

// (...args) => add3(add2(...args))

/**
 * let funcs = [add3, add2, add1]
 * 1 a=add3, b=add2  return (...args)=> add3(add2(...args))
 * 2 a=(...args) => add3(add2(...args)), b= add1 return  add3(add2(add1(...args)))
 *
 */

const fn = compose(add3, add2, add1)
console.log(fn("tt"))
