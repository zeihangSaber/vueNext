import { createVNode } from "./vnode"

export function createaAppAPI(render) {
  return function createApp(rootComponent, rootProps) {
    const app = {
      _props: rootProps,
      _component: rootComponent,
      _container: null,
      mount(container) {
        const vnode = createVNode(rootComponent, rootProps)
        render(vnode, container)
      },
    }
    return app
  }
}
