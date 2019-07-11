import 'reflect-metadata';
import { SUBSCRIPTIONS } from '../symbols';

function subscription(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!Reflect.hasOwnMetadata(SUBSCRIPTIONS, target)) {
        Reflect.defineMetadata(SUBSCRIPTIONS, {}, target);
    }
    const metadata = Reflect.getMetadata(SUBSCRIPTIONS, target);
    metadata[propertyKey] = descriptor.value;
    return descriptor;
}

export default subscription;
