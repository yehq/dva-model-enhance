import 'reflect-metadata';
import { SUBSCRIPTIONS, NAMESPACE } from '../symbols';
import modelsContainer from '../modelsContainer';

/**
 * @param target
 * @param propertyKey
 * @param descriptor
 * @example
 *
 *     import { SubscriptionAPI } from 'dva';
 *
 *     class Example {
 *         @subscription
 *         subscriptionTest({ history, dispatch }: SubscriptionAPI) {}
 *     }
 *
 */
function subscription(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!Reflect.hasOwnMetadata(SUBSCRIPTIONS, target)) {
        Reflect.defineMetadata(SUBSCRIPTIONS, {}, target);
    }
    const metadata = Reflect.getMetadata(SUBSCRIPTIONS, target);
    metadata[propertyKey] = () => {
        const namespace = Reflect.getMetadata(NAMESPACE, target);
        let currentThis = target;
        if (namespace) {
            currentThis = modelsContainer.get(namespace) || target;
        }
        descriptor.value.bind(currentThis);
    };
    return descriptor;
}

export default subscription;
