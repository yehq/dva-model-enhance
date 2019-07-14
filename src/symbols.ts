/**
 * subscription path
 */
export const PATH = Symbol.for('PATH');
export const STATE = Symbol.for('STATE');
export const STATE_KEY = Symbol.for('STATE_KEY');
// dva model
export const MODEL = Symbol.for('MODEL');
// dva namespace
export const NAMESPACE = Symbol.for('NAMESPACE');
// dva effects
export const EFFECTS = Symbol.for('EFFECTS');
// dva reducers
export const REDUCERS = Symbol.for('REDUCERS');
// dva subscriptions
export const SUBSCRIPTIONS = Symbol.for('SUBSCRIPTIONS');
// 临时 namespace， 处理当通过 dispatch({ type: '' }) 发起 action 时的内部方法 调用 丢失 namespace 的问题
export const TEMPORARY_NAMESPACE = Symbol.for('TEMPORARY_NAMESPACE');
