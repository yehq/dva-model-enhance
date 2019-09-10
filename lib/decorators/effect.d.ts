import { EffectOptions } from '../interfaces';
declare function effect(options?: EffectOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any;
export default effect;
