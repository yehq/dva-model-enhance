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
function path(url, options) {
    return function (target, propertyKey, descriptor) {
        if (!metadata.has(PATH, target)) {
            metadata.define(PATH, [], target);
        }
        var paths = metadata.get(PATH, target);
        paths.push({
            url: url,
            options: options,
            listener: descriptor.value,
        });
        descriptor.enumerable = false;
    };
}
export default path;
//# sourceMappingURL=path.js.map