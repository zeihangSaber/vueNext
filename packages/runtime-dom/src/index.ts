import { createRenderer } from '@vue/runtime-core/src'
import {extend} from '@vue/shared/src'
import {nodeOps} from './nodeOps'
import {patchProp} from './patchProp'

const rendererOptions = extend({patchProp}, nodeOps)

export function createApp(rootComponent, rootProps = null) {
  const app = createRenderer(rendererOptions).createApp(rootComponent, rootProps)
  let {mount} = app
  // 函数劫持
  app.mount = function (container) {
    container = nodeOps.querySelector(container)
    container.innerHtml = ''
    mount(container)
  }
  return app
}
