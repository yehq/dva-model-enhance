import 'reflect-metadata';
import modelExtend from 'dva-model-extend';
import { DvaModelOptions, SubscriptionPath } from '../interfaces';
import { NAMESPACE, MODEL, EFFECTS, REDUCERS, SUBSCRIPTIONS, PATH, STATE, STATE_KEY } from '../symbols';
import { Subscription, Model } from 'dva';
import { matchPath } from 'react-router';
import modelsContainer from '../modelsContainer';

function model(dvaModelOptions: DvaModelOptions) {
    const { namespace, state = {}, stateKey = 'state' } = dvaModelOptions;
    return (target: any) => {
        /**
         * 当不存在 state 装饰器时，由 model 装饰器设置原型链上的 state
         */
        if (!Reflect.hasOwnMetadata(STATE_KEY, target.prototype)) {
            Reflect.defineMetadata(STATE, state, target.prototype);
            Reflect.defineMetadata(STATE_KEY, stateKey, target.prototype);
        }
        const effects = Reflect.getMetadata(EFFECTS, target.prototype) || {};
        const reducers = Reflect.getMetadata(REDUCERS, target.prototype) || {};
        const subscriptions = Reflect.getMetadata(SUBSCRIPTIONS, target.prototype) || {};
        const paths = Reflect.getMetadata(PATH, target.prototype);
        if (paths) {
            subscriptions.__pathsListener = getPathsListener(paths, namespace);
        }
        const model = {
            namespace,
            state: Reflect.getMetadata(STATE, target.prototype),
            effects,
            reducers,
            subscriptions,
        };
        const parentProto = Reflect.getPrototypeOf(target.prototype) as any;
        if (parentProto.constructor.name !== 'Object' && Reflect.hasMetadata(MODEL, parentProto)) {
            // 继承 model
            Reflect.defineMetadata(MODEL, modelExtend(Reflect.getMetadata(MODEL, parentProto), model), target.prototype);
        } else {
            Reflect.defineMetadata(MODEL, model, target.prototype);
        }

        const finalModel: Model = Reflect.getMetadata(MODEL, target.prototype);
        Reflect.defineProperty(target.prototype, stateKey, {
            value: finalModel.state,
            writable: true,
            configurable: true,
        });
        if (namespace) {
            Reflect.defineMetadata(NAMESPACE, namespace, target.prototype);
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
