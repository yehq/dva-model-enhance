import modelExtend from 'dva-model-extend';
import { DvaModelOptions, SubscriptionPath } from '../interfaces';
import {
    NAMESPACE,
    MODEL,
    EFFECTS,
    REDUCERS,
    SUBSCRIPTIONS,
    PATH,
    STATE,
    STATE_KEY,
} from '../symbols';
import { Subscription, Model } from 'dva';
import { matchPath } from 'react-router';
import modelsContainer from '../modelsContainer';
import metadata from '../metadata';
import config from '../config';

function model(dvaModelOptions: DvaModelOptions) {
    const { namespace, state = {}, stateKey = 'state' } = dvaModelOptions;
    return (target: any) => {
        /**
         * 当不存在 state 装饰器时，由 model 装饰器设置原型链上的 state
         */
        if (!metadata.has(STATE_KEY, target.prototype)) {
            metadata.define(STATE, state, target.prototype);
            metadata.define(STATE_KEY, stateKey, target.prototype);
        }
        const effects = metadata.get(EFFECTS, target.prototype) || {};
        const reducers = metadata.get(REDUCERS, target.prototype) || {};
        const subscriptions = metadata.get(SUBSCRIPTIONS, target.prototype) || {};
        const paths = metadata.get(PATH, target.prototype);
        if (paths) {
            subscriptions.__pathsListener = getPathsListener(paths, namespace);
        }
        const model = {
            namespace,
            state: metadata.get(STATE, target.prototype),
            effects,
            reducers,
            subscriptions,
        };
        const parentProto = Reflect.getPrototypeOf(target.prototype) as any;
        if (parentProto.constructor.name !== 'Object' && metadata.has(MODEL, parentProto)) {
            // 继承 model
            metadata.define(
                MODEL,
                modelExtend(metadata.get(MODEL, parentProto), model),
                target.prototype
            );
        } else {
            metadata.define(MODEL, model, target.prototype);
        }

        const finalModel: Model = metadata.get(MODEL, target.prototype);
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
function getPathsListener(subscriptionPaths: SubscriptionPath[], namespace?: string): Subscription {
    return function({ history, dispatch }) {
        if (!namespace) {
            return;
        }
        const currentThis = modelsContainer.get(namespace);
        return history.listen((location, action) => {
            const { pathname } = location;
            subscriptionPaths.forEach(({ options, url, listener }) => {
                const result = matchPath<any>(pathname, {
                    path: url,
                    ...options,
                });
                if (result) {
                    listener.call(currentThis, result, dispatch, location, action);
                }
            });
        });
    };
}
