import {isObject} from '@vue/shared/src'
import {
  mutableHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from './baseHandlers'

// 柯里化
export function reactive(target) {
  return createReactiveObject(target, false, mutableHandlers)
}
export function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers)
}
export function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers)
}
export function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHandlers)
}

const reactiveMap = new WeakMap() // 会自动垃圾回收，不会内存泄漏，存储的key只能是对象
const readOnlyMap = new WeakMap()
export function createReactiveObject(target, isReadOnly, baseHandler) {
  // 目标必须是对象
  if (!isObject(target)) return target

  const proxyMap = isReadOnly ? readOnlyMap : reactiveMap

  const existProxy = proxyMap.get(target)

  // 如果代理过，就直接返回
  if (existProxy) return existProxy

  const proxy = new Proxy(target, baseHandler)

  // 将代理结果缓存起来
  proxyMap.set(target, proxy)
  return proxy
}
