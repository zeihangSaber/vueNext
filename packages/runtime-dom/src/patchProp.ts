import {patchAttr} from './modules/attr'
import {patchClass} from './modules/class'
import {patchEvent} from './modules/events'
import {patchStyle} from './modules/style'

export const patchProp = (el, key, prevValue, nextValue) => {
  switch (key) {
    case 'class':
      patchClass(el, nextValue)
      break
    case 'style':
      patchStyle(el, prevValue, nextValue)
      break
    case 'attr':
      // 不是事件 才是属性
      if (/^on[^A-Z]/.test(key)) {
        patchEvent(el, key, nextValue)
      } else {
        patchAttr(el, key, nextValue)
      }
      break
    default:
      break
  }
}
