var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { REDUCERS, NAMESPACE, TEMPORARY_NAMESPACE, STATE_KEY } from '../symbols';
import modelsContainer from '../modelsContainer';
import metadata from '../metadata';
function reducer(target, propertyKey, descriptor) {
    // 调用 reducer 时 同步 state 到当前 class 实例
    var func = function (state, action) {
        var namespace = action.type.split('/')[0];
        var currentThis = modelsContainer.get(namespace) || target;
        var stateKey = metadata.get(STATE_KEY, target);
        currentThis[stateKey] = state;
        var newState = descriptor.value.apply(currentThis, action.payload);
        currentThis[stateKey] = newState;
        return newState;
    };
    if (!metadata.has(REDUCERS, target)) {
        metadata.define(REDUCERS, {}, target);
    }
    var reducers = metadata.get(REDUCERS, target);
    reducers[propertyKey] = func;
    // 让修饰的方法 返回 redux action
    return __assign({}, descriptor, { value: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var namespace = metadata.get(NAMESPACE, this) || metadata.get(TEMPORARY_NAMESPACE, this);
            return {
                type: namespace + "/" + propertyKey,
                payload: args,
            };
        } });
}
export default reducer;
//# sourceMappingURL=reducer.js.map