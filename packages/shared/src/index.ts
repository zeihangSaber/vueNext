export const isObject = target => typeof target === 'object' && target !== null
export const extend = Object.assign
export const isArray = Array.isArray
export const isFunction = val => typeof val === 'function'
export const isNumber = val => typeof val === 'number'
export const isString = val => typeof val === 'string'
export const isIntegerKey = key => parseInt(key) + '' === key
export const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key)
export const hasChange = (oldVal, newVal) => oldVal !== newVal

export * from './shapeFlags'