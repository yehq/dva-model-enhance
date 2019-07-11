import 'reflect-metadata';
import modelExtend from 'dva-model-extend';
import { DvaModelOptions, SubscriptionPath } from '../interfaces';
import { NAMESPACE, MODEL, EFFECTS, REDUCERS, SUBSCRIPTIONS, PATH } from '../symbols';
import { Subscription } from 'dva';
import { matchPath } from 'react-router';

function model(dvaModelOptions: DvaModelOptions) {
    const { namespace, state = {} } = dvaModelOptions;
    return (target: Function) => {
        Reflect.defineMetadata(NAMESPACE, namespace, target.prototype);
        const effects = Reflect.getMetadata(EFFECTS, target.prototype) || {};
        const reducers = Reflect.getMetadata(REDUCERS, target.prototype) || {};
        const subscriptions = Reflect.getMetadata(SUBSCRIPTIONS, target.prototype) || {};
        const paths = Reflect.getMetadata(PATH, target.prototype);
        if (paths) {
            subscriptions.__pathsListener = getPathsListener(paths);
        }
        const model = {
            namespace,
            state,
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
    };
}

export default model;

function getPathsListener(subscriptionPaths: SubscriptionPath[]): Subscription {
    return ({ history, dispatch }) => {
        return history.listen((location, action) => {
            const { pathname } = location;
            subscriptionPaths.forEach(({ options, url, listener }) => {
                const result = matchPath<any>(pathname, {
                    path: url,
                    ...options,
                    strict: false,
                });
                if (result) {
                    listener(result, dispatch, location, action);
                }
            });
        });
    };
}
