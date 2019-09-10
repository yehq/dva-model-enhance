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
function subscription(target, propertyKey, descriptor) {
    if (!metadata.has(SUBSCRIPTIONS, target)) {
        metadata.define(SUBSCRIPTIONS, {}, target);
    }
    var subscriptions = metadata.get(SUBSCRIPTIONS, target);
    subscriptions[propertyKey] = function () {
        var namespace = metadata.get(NAMESPACE, target);
        var currentThis = target;
        if (namespace) {
            currentThis = modelsContainer.get(namespace) || target;
        }
        descriptor.value.bind(currentThis);
    };
    return descriptor;
}
export default subscription;
//# sourceMappingURL=subscription.js.map