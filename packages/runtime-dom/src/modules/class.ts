export const patchClass = (el, value = null) => {
  if (value == null) {
    value = ''
  }
  el.className = value
}
