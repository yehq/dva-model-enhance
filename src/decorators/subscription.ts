import { SUBSCRIPTIONS, NAMESPACE } from '../symbols';
import modelsContainer from '../modelsContainer';
import metadata from '../metadata';

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
    if (!metadata.has(SUBSCRIPTIONS, target)) {
        metadata.define(SUBSCRIPTIONS, {}, target);
    }
    const subscriptions = metadata.get(SUBSCRIPTIONS, target);
    subscriptions[propertyKey] = () => {
        const namespace = metadata.get(NAMESPACE, target);
        let currentThis = target;
        if (namespace) {
            currentThis = modelsContainer.get(namespace) || target;
        }
        descriptor.value.bind(currentThis);
    };
    return descriptor;
}

export default subscription;
