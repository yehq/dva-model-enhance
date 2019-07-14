import 'reflect-metadata';
import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import { EffectOptions } from '../interfaces';
import { EFFECTS, NAMESPACE, TEMPORARY_NAMESPACE } from '../symbols';
import modelsContainer from '../modelsContainer';

function effect(options?: EffectOptions) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const func = function*(action: AnyAction, effects: EffectsCommandMap) {
            const namespace = action.type.split('/')[0];

            // /**
            //  * 外部直接 dispatch({ type: 'type' }) 时
            //  * 被继承的 class 方法上内部没办法获得 namespace
            //  * 此时需要设置临时 namespace 使用
            //  */
            // if (!Reflect.hasMetadata(NAMESPACE, target)) {
            //     const namespace = action.type.split('/')[0];
            //     Reflect.defineMetadata(TEMPORARY_NAMESPACE, namespace, target);
            // }
            const currentThis = modelsContainer.get(namespace) || target;
            currentThis.effects = effects;
            const result = yield* descriptor.value.apply(currentThis, action.payload);

            // Reflect.deleteMetadata(TEMPORARY_NAMESPACE, target);
            return result;
        };
        const targetFunc = options ? [func, options] : func;

        if (!Reflect.hasOwnMetadata(EFFECTS, target)) {
            Reflect.defineMetadata(EFFECTS, {}, target);
        }
        const effects = Reflect.getMetadata(EFFECTS, target);
        effects[propertyKey] = targetFunc;

        // 让修饰的方法 返回 redux action
        return {
            ...descriptor,
            value: function(...args: any[]) {
                const namespace = Reflect.getMetadata(NAMESPACE, this) || Reflect.getMetadata(TEMPORARY_NAMESPACE, this);
                return {
                    type: `${namespace}/${propertyKey}`,
                    payload: args,
                };
            },
        } as any;
    };
}

export default effect;
