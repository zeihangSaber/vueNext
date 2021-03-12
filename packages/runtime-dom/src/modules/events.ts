export const patchEvent = (el, key, value) => {
  const invokers = el._vei || (el._vei = {})
  const exists = invokers[key]
  if (value && exists) {
    exists.value = value
  } else {
    const eventName = key.slice(2).toLocaleLowerCase()
    if (value) {
      // 没绑过事件
      let invoker = (invokers[key] = createInvoker(value))
      el.addEventListener(eventName, invoker)
    } else {
      // 删除事件
      el.removeEventListener(eventName, exists)
      invokers[key] = undefined
    }
  }
}

function createInvoker(value) {
  const invoker = (...agr) => {
    invoker.value(...agr)
  }
  invoker.value = value
  return invoker
}
