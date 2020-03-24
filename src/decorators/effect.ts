import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import { EffectOptions } from '../interfaces';
import { EFFECTS, NAMESPACE, TEMPORARY_NAMESPACE, STATE_KEY } from '../symbols';
import modelsContainer from '../modelsContainer';
import metadata from '../metadata';

function effect(options?: EffectOptions) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const func = function*(action: AnyAction, effects: EffectsCommandMap) {
            const namespace = action.type.split('/')[0];
            const currentThis = modelsContainer.get(namespace) || target;
            currentThis.effects = effects;
            const stateKey = metadata.get(STATE_KEY, target);
            /**
             * class 直接定义 state 会造成 state 初始化为 undefined, 此时负值为初始值
             * 使用 @babel/plugin-transform-typescript 设置 allowDeclareFields 为 true。此时可以使用 declare state, 此时不会 被 undefined 覆盖
             */
            if (typeof currentThis[stateKey] === "undefined") {
                currentThis[stateKey] = target[stateKey];
            }
            const result = yield* descriptor.value.apply(currentThis, action.payload);
            return result;
        };
        const targetFunc = options ? [func, options] : func;

        if (!metadata.has(EFFECTS, target)) {
            metadata.define(EFFECTS, {}, target);
        }
        const effects = metadata.get(EFFECTS, target);
        effects[propertyKey] = targetFunc;

        // 让修饰的方法 返回 redux action
        return {
            ...descriptor,
            value: function(...args: any[]) {
                const namespace =
                    metadata.get(NAMESPACE, this) || metadata.get(TEMPORARY_NAMESPACE, this);
                return {
                    type: `${namespace}/${propertyKey}`,
                    payload: args,
                };
            },
        } as any;
    };
}

export default effect;
