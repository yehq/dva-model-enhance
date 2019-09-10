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
import modelExtend from 'dva-model-extend';
import { NAMESPACE, MODEL, EFFECTS, REDUCERS, SUBSCRIPTIONS, PATH, STATE, STATE_KEY, } from '../symbols';
import { matchPath } from 'react-router';
import modelsContainer from '../modelsContainer';
import metadata from '../metadata';
import config from '../config';
function model(dvaModelOptions) {
    var namespace = dvaModelOptions.namespace, _a = dvaModelOptions.state, state = _a === void 0 ? {} : _a, _b = dvaModelOptions.stateKey, stateKey = _b === void 0 ? 'state' : _b;
    return function (target) {
        /**
         * 当不存在 state 装饰器时，由 model 装饰器设置原型链上的 state
         */
        if (!metadata.has(STATE_KEY, target.prototype)) {
            metadata.define(STATE, state, target.prototype);
            metadata.define(STATE_KEY, stateKey, target.prototype);
        }
        var effects = metadata.get(EFFECTS, target.prototype) || {};
        var reducers = metadata.get(REDUCERS, target.prototype) || {};
        var subscriptions = metadata.get(SUBSCRIPTIONS, target.prototype) || {};
        var paths = metadata.get(PATH, target.prototype);
        if (paths) {
            subscriptions.__pathsListener = getPathsListener(paths, namespace);
        }
        var model = {
            namespace: namespace,
            state: metadata.get(STATE, target.prototype),
            effects: effects,
            reducers: reducers,
            subscriptions: subscriptions,
        };
        var parentProto = Reflect.getPrototypeOf(target.prototype);
        if (parentProto.constructor.name !== 'Object' && metadata.has(MODEL, parentProto)) {
            // 继承 model
            metadata.define(MODEL, modelExtend(metadata.get(MODEL, parentProto), model), target.prototype);
        }
        else {
            metadata.define(MODEL, model, target.prototype);
        }
        var finalModel = metadata.get(MODEL, target.prototype);
        Reflect.defineProperty(target.prototype, stateKey, {
            value: finalModel.state,
            writable: true,
            configurable: true,
        });
        if (namespace) {
            metadata.define(NAMESPACE, namespace, target.prototype);
            if (config.autoAddModel) {
                // 自动加载model
                config.addModel(finalModel);
            }
        }
    };
}
export default model;
/**
 * 指定路由监听的 subscription
 * @param subscriptionPaths
 */
function getPathsListener(subscriptionPaths, namespace) {
    return function (_a) {
        var history = _a.history, dispatch = _a.dispatch;
        if (!namespace) {
            return;
        }
        var currentThis = modelsContainer.get(namespace);
        return history.listen(function (location, action) {
            var pathname = location.pathname;
            subscriptionPaths.forEach(function (_a) {
                var options = _a.options, url = _a.url, listener = _a.listener;
                var result = matchPath(pathname, __assign({ path: url }, options));
                if (result) {
                    listener.call(currentThis, result, dispatch, location, action);
                }
            });
        });
    };
}
//# sourceMappingURL=model.js.map