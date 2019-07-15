import { AnyAction } from 'redux';
import { REDUCERS, NAMESPACE, TEMPORARY_NAMESPACE, STATE_KEY } from '../symbols';
import modelsContainer from '../modelsContainer';
import metadata from '../metadata';

function reducer(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // 调用 reducer 时 同步 state 到当前 class 实例
    const func = (state: any, action: AnyAction) => {
        const namespace = action.type.split('/')[0];
        const currentThis = modelsContainer.get(namespace) || target;
        const stateKey = metadata.get(STATE_KEY, target);
        currentThis[stateKey] = state;
        const newState = descriptor.value.apply(currentThis, action.payload);
        currentThis[stateKey] = newState;
        return newState;
    };
    if (!metadata.has(REDUCERS, target)) {
        metadata.define(REDUCERS, {}, target);
    }
    const reducers = metadata.get(REDUCERS, target);
    reducers[propertyKey] = func;

    // 让修饰的方法 返回 redux action
    return {
        ...descriptor,
        value: function(...args: any[]) {
            const namespace = metadata.get(NAMESPACE, this) || metadata.get(TEMPORARY_NAMESPACE, this);
            return {
                type: `${namespace}/${propertyKey}`,
                payload: args,
            } as any;
        },
    };
}

export default reducer;
