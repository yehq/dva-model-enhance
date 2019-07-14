import 'reflect-metadata';
import { STATE, STATE_KEY } from '../symbols';

function state(initialState?: object): PropertyDecorator {
    return (target: any, propertyKey) => {
        Reflect.defineMetadata(STATE, initialState, target);
        Reflect.defineMetadata(STATE_KEY, propertyKey, target);
        const descriptor = Reflect.getOwnPropertyDescriptor(target, propertyKey) || {
            writable: true,
            configurable: true,
        };
        descriptor.value = Reflect.getMetadata(STATE, target);
        Reflect.defineProperty(target, propertyKey, descriptor);
    };
}

export default state;
