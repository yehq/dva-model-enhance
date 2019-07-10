import { EffectType, EffectsCommandMap } from 'dva';
import modelExtend from 'dva-model-extend';
import { DvaModelOptions } from './interfaces';
import { AnyAction } from 'redux';

export function dvaModel(dvaModelOptions: DvaModelOptions) {
    const { namespace, state = {} } = dvaModelOptions;
    return (target: Function) => {
        const parentProto = Reflect.getPrototypeOf(target.prototype) as any;
        if (!target.prototype.$$modelInfo) {
            target.prototype.$$modelInfo = {};
        }
        if (parentProto.constructor.name !== 'Object' && parentProto.$$modelInfo) {
            // 继承 model
            target.prototype.$$modelInfo = modelExtend(parentProto.$$modelInfo, target.prototype.$$modelInfo);
        }
        target.prototype.$$modelInfo.namespace = namespace;
        // 设置 初始化的 state
        const newState = {
            ...target.prototype.$$modelInfo.state,
            ...state,
        };
        target.prototype.$$modelInfo.state = newState;
        target.prototype.state = newState;
    };
}

export function reducer(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let that = target;
    if (!target.$$modelInfo) {
        target.$$modelInfo = {
            effects: {},
            reducers: {},
        };
    }
    // 调用 reducer 时 同步 state 到当前 class 实例
    target.$$modelInfo.reducers[propertyKey] = (state: any, action: AnyAction) => {
        that.state = state;
        const newState = descriptor.value.apply(that, action.payload);
        that.state = newState;
        return newState;
    };
    // 让修饰的方法 返回 redux action
    return {
        ...descriptor,
        value: function(...args: any[]) {
            that = this;
            return {
                type: `${(Reflect.getPrototypeOf(this) as any).$$modelInfo.namespace}/${propertyKey}`,
                payload: args,
            } as any;
        },
    };
}

interface EffectOptions {
    type: EffectType;
    // 当 type 为 throttle 时使用，设置节流时间
    ms?: number;
}

export function effect(options?: EffectOptions) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let that = target;
        if (!target.$$modelInfo) {
            target.$$modelInfo = {
                effects: {},
                reducers: {},
            };
        }
        const func = function*(action: AnyAction, effects: EffectsCommandMap) {
            that.effects = effects;
            const result = yield* descriptor.value.apply(that, action.payload);
            return result;
        };
        target.$$modelInfo.effects[propertyKey] = options ? [func, options] : func;
        // 让修饰的方法 返回 redux action
        return {
            ...descriptor,
            value: function(...args: any[]) {
                that = this;
                return {
                    type: `${(Reflect.getPrototypeOf(this) as any).$$modelInfo.namespace}/${propertyKey}`,
                    payload: args,
                };
            },
        } as any;
    };
}
