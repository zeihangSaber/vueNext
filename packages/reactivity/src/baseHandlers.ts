import {extend, hasChange, hasOwn, isArray, isIntegerKey, isObject} from '@vue/shared/src'
import {track, trigger} from './effect'
import {TrackOpTypes, TriggerOrTypes} from './operators'
import {reactive, readonly} from './reactive'

const readonlyObj = {
  set(target, key) {
    console.warn(`set on key ${key} falied`)
  },
}

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

const set = createSetter()
const shallowSet = createSetter(true)

export const mutableHandlers = {
  get,
  set,
}
export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet,
}
export const readonlyHandlers = extend(
  {
    get: readonlyGet,
  },
  readonlyObj,
)
export const shallowReadonlyHandlers = extend(
  {
    get: shallowReadonlyGet,
  },
  readonlyObj,
)

// proxy + reflect
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    console.log('ssr', key)  
    // target[key]
    const res = Reflect.get(target, key, receiver)
    if (!isReadonly) {
      // 执行effect时会取值, 收集effect
      track(target, TrackOpTypes.GET, key)
    }
    if (shallow) {
      return res
    }
    if (isObject(res)) {
      // 懒代理 取值时进行代理
      return isReadonly ? readonly(res) : reactive(res)
    }
    return res
  }
}
function createSetter(Shallow = false) {
  return function set(target, key, value, receiver) {
    const oldVal = target[key]
    // isArray(oldVal) &&
    // target[key] = value
    const hasKey =
      isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key)
    const result = Reflect.set(target, key, value, receiver)
    if (!hasKey) {
      // 新增 数据
      trigger(target, TriggerOrTypes.ADD, key, value)
    } else if (hasChange(oldVal, value)) {
      // 修改 数据
      trigger(target, TriggerOrTypes.SET, key, value, oldVal)
    }
    return result
  }
}
