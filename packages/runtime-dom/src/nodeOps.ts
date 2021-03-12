export const nodeOps = {
  createElement: tagName => document.createElement(tagName),
  remove: child => {
    const parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  },
  insert: (child, parent, anchor = null) => {
    // null 相当于 appendappendChild
    parent.insertBefore(child, anchor)
  },
  querySelector: selector => document.querySelector(selector),
  setElementText: (el, text) => el.textContent(text),
  createText: text => document.createTextNode(text),
  setText: (node, text) => node.nodeValue = text
}
