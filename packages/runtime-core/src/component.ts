import { ShapeFlags } from "@vue/shared/src"

export function createComponentInstance(vnode) {
  const instance = {
    vnode,
    type: vnode.type,
    props: {},
    attrs: {},
    slots: {},
    setupState: {},
    render: null,
    ctx: {},
    isMounted: false
  }
  instance.ctx = {_: instance}
  return instance
}

export function setupComponent(instance) {
    const {props, children} = instance.vnode
    instance.props = props
    instance.children = children
    const isStateful = instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
    if (isStateful) {
        setupStatefulComponent(instance)
    }
}

function setupStatefulComponent(instance) {
    const Component = instance.type
    const {setup} = Component
    let setupState = createSetupContext(instance)
    setup(instance.props, setupState)
}
function createSetupContext(instance) {
    return {
        attr: instance.attr,
        slots: instance.slots,
        emit:() => {},
        expose: () => {}
    }
}
