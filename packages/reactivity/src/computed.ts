import {isFunction} from '@vue/shared/src'
import {effect, track, trigger} from './effect'
import {TrackOpTypes, TriggerOrTypes} from './operators'

class ComputedRefImpl {
  private _dirty = true
  public _value
  public effect
  constructor(getter, public setter) {
    this.effect = effect(getter, {
      lazy: true,
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = false
        }
        trigger(this, TriggerOrTypes.SET, 'value')
      },
    })
  }
  get value() {
    if (this._dirty) {
      this._value = this.effect()
      this._dirty = false
    }
    track(this, TrackOpTypes.GET, 'value')
    return this._value
  }
  set value(newValue) {
    this.setter(newValue)
  }
}

export function computed(getterOrOptions) {
  let getter
  let setter
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = () => {
      console.warn('computed value must be readonly')
    }
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  return new ComputedRefImpl(getter, setter)
}
