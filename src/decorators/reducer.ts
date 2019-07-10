import 'reflect-metadata';
import { AnyAction } from 'redux';
import { REDUCERS, NAMESPACE } from '../symbols';

function reducer(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let that = target;
    // 调用 reducer 时 同步 state 到当前 class 实例
    const func = (state: any, action: AnyAction) => {
        that.state = state;
        const newState = descriptor.value.apply(that, action.payload);
        that.state = newState;
        return newState;
    };
    if (!Reflect.hasOwnMetadata(REDUCERS, target)) {
        Reflect.defineMetadata(REDUCERS, {}, target);
    }
    const reducers = Reflect.getMetadata(REDUCERS, target);
    reducers[propertyKey] = func;

    // 让修饰的方法 返回 redux action
    return {
        ...descriptor,
        value: function(...args: any[]) {
            that = this;
            return {
                type: `${Reflect.getMetadata(NAMESPACE, this)}/${propertyKey}`,
                payload: args,
            } as any;
        },
    };
}

export default reducer;
