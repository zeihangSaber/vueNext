import {isArray, isIntegerKey} from '@vue/shared/src'
import {TriggerOrTypes} from './operators'

export function effect(fn, options: any = {}) {
  const effect = createReactiveEffect(fn, options)
  if (!options.lazy) {
    // 默认执行一次
    effect()
  }
  return effect
}

let uid = 0
let activeEffect
const effectStack = []

function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    // 保证不会无限循环
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effectStack)
        activeEffect = effect
        return fn()
      } finally {
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  effect.id = uid++
  effect._isEffect = true
  effect.raw = fn
  effect.options = options
  return effect
}

const targetMap = new WeakMap()
export function track(target, type, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    // 有可能对应多个 effect  用个数组存储
    depsMap.set(key, (dep = new Set()))
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
  }
  console.log(targetMap)
}

export function trigger(target, type, key?, newVal?, oldVal?) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  // effect 去重
  const effects = new Set()
  const add = effectsToAdd => {
    if (effectsToAdd) {
      effectsToAdd.forEach(effect => {
        effects.add(effect)
      })
    }
  }
  // 修改数组长度 贼麻烦 尤其是改少了
  if (key === 'length' && isArray(target)) {
    depsMap.forEach((dep, idx) => {
      if (key === 'length' || idx > newVal) {
        add(dep)
      }
    })
  } else {
    if (key !== undefined) {
      add(depsMap.get(key))
    }
    switch (type) {
      case TriggerOrTypes.ADD:
        if (isArray(target) && isIntegerKey(key)) {
          console.log('~~~~~~', depsMap.get('length'))
          add(depsMap.get('length'))
        }
        break

      default:
        break
    }
  }
  effects.forEach((effect: any) => {
    if (effect.options.scheduler) {
      effect.options.scheduler()
    } else {
      effect()
    }
  })
}
