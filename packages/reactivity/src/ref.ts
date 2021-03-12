import {hasChange, isArray, isObject} from '@vue/shared/src'
import {track, trigger} from './effect'
import {TrackOpTypes, TriggerOrTypes} from './operators'
import {reactive} from './reactive'

// 可以是对象
export function ref(value) {
  return createRef(value)
}

// ref 使用 defineProperty

export function shallowRef(value) {
  return createRef(value, true)
}

// 如果是对象 直接用 reactive
const convert = val => (isObject(val) ? reactive(val) : val)
class RefImpl {
  public _value
  public __v_isRef = true // 表示是个 Ref 属性
  constructor(public rawValue, public shallow) {
    this._value = shallow ? rawValue : convert(rawValue)
  }
  // 类的属性访问器
  get value() {
    track(this, TrackOpTypes.GET, 'value')
    // 代理
    return this._value
  }
  set value(newValue) {
    // 判断老值和新值是否有变化
    if (hasChange(newValue, this.rawValue)) {
      this.rawValue = newValue
      this._value = this.shallow ? newValue : convert(newValue)
      trigger(this, TriggerOrTypes.SET, 'value', newValue)
    }
  }
}

function createRef(rawValue, shallow = false) {
  return new RefImpl(rawValue, shallow)
}

class ObjectRefImpl {
  public __v_isRef = true
  constructor(public target, public key) {}
  get value() {
    return this.target[this.key]
  }
  set value(newValue) {
    this.target[this.key] = newValue
  }
}

// 可以把一个对象的值转化为 ref
export function toRef(target, key) {
  return new ObjectRefImpl(target, key)
}

export function toRefs(object) {
  const ret = isArray(object) ? new Array(Object.length) : {}
  for (let key in object) {
    ret[key] = toRef(Object, key)
  }
  return ret
}
