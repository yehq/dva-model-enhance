import { STATE, STATE_KEY } from '../symbols';
import metadata from '../metadata';

function state(initialState?: object): PropertyDecorator {
    return (target: any, propertyKey) => {
        metadata.define(STATE, initialState, target);
        metadata.define(STATE_KEY, propertyKey, target);
        const descriptor = Reflect.getOwnPropertyDescriptor(target, propertyKey) || {
            writable: true,
            configurable: true,
        };
        descriptor.value = metadata.get(STATE, target);
        Reflect.defineProperty(target, propertyKey, descriptor);
    };
}

export default state;
