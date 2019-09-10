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
declare function subscription(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
export default subscription;
