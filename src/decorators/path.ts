import 'reflect-metadata';
import { SubscriptionOptions, SubscriptionPath } from '../interfaces';
import { PATH } from '../symbols';

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
function path(url: string, options?: SubscriptionOptions) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (!Reflect.hasOwnMetadata(PATH, target)) {
            Reflect.defineMetadata(PATH, [], target);
        }
        const metadata: SubscriptionPath[] = Reflect.getMetadata(PATH, target);
        metadata.push({
            url,
            options,
            listener: descriptor.value,
        });
        descriptor.enumerable = false;
    };
}
export default path;
