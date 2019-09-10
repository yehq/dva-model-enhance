import { SubscriptionOptions } from '../interfaces';
/**
 * @param url
 * @param options
 * @example
 *
 *     import { match } from 'react-router';
 *     import { Dispatch } from 'redux';
 *     import { Location, Action } from 'history';
 *
 *     class Example {
 *         @path('/example')
 *         pathExample(matchResult: match<any>, dispatch: Dispatch, location: Location, action: Action) {}
 *     }
 */
declare function path(url: string, options?: SubscriptionOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export default path;
