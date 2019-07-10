import 'reflect-metadata';
import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import { EffectOptions } from '../interfaces';
import { EFFECTS, NAMESPACE } from '../symbols';

function effect(options?: EffectOptions) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let that = target;
        const func = function*(action: AnyAction, effects: EffectsCommandMap) {
            that.effects = effects;
            const result = yield* descriptor.value.apply(that, action.payload);
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
                that = this;
                return {
                    type: `${Reflect.getMetadata(NAMESPACE, this)}/${propertyKey}`,
                    payload: args,
                };
            },
        } as any;
    };
}

export default effect;
