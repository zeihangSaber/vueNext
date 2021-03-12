import {ShapeFlags} from '@vue/shared/src'
import {createaAppAPI} from './ApiCreateApp'
import { createComponentInstance, setupComponent } from './component'

// 创建渲染起
export function createRenderer(rendererOptions) {
  const setupRenderEffect = () => {}
  const mountComponent = (initialVNode, container) => {
    console.log(initialVNode, container)
    // 获取render方法
    const instance = (initialVNode.component = createComponentInstance(initialVNode))
    setupComponent(instance)
    setupRenderEffect()
  }
  const processComponent = (n1, n2, container) => {
    if (n1 == null) {
      // 初始化
      mountComponent(n2, container)
    } else {
      // 组件更新
    }
  }
  const patch = (n1, n2, container) => {
    const {shapeFlag} = n2
    if (shapeFlag & ShapeFlags.ELEMENT) {
      console.log('yuanshu')
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      processComponent(n1, n2, container)
    }
  }
  const render = (vnode, container) => {
    // 创建真实 dom
    patch(null, vnode, container)
  }
  return {
    createApp: createaAppAPI(render),
  }
}
