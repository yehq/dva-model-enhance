/**
 * subscription path
 */
export var PATH = Symbol.for('PATH');
export var STATE = Symbol.for('STATE');
export var STATE_KEY = Symbol.for('STATE_KEY');
// dva model
export var MODEL = Symbol.for('MODEL');
// dva namespace
export var NAMESPACE = Symbol.for('NAMESPACE');
// dva effects
export var EFFECTS = Symbol.for('EFFECTS');
// dva reducers
export var REDUCERS = Symbol.for('REDUCERS');
// dva subscriptions
export var SUBSCRIPTIONS = Symbol.for('SUBSCRIPTIONS');
// 临时 namespace， 处理当通过 dispatch({ type: '' }) 发起 action 时的内部方法 调用 丢失 namespace 的问题
export var TEMPORARY_NAMESPACE = Symbol.for('TEMPORARY_NAMESPACE');
//# sourceMappingURL=symbols.js.map