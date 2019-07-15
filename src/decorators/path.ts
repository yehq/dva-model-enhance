import { SubscriptionOptions, SubscriptionPath } from '../interfaces';
import { PATH } from '../symbols';
import metadata from '../metadata';

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
        if (!metadata.has(PATH, target)) {
            metadata.define(PATH, [], target);
        }
        const paths: SubscriptionPath[] = metadata.get(PATH, target);
        paths.push({
            url,
            options,
            listener: descriptor.value,
        });
        descriptor.enumerable = false;
    };
}
export default path;
