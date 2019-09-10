import { MODEL, NAMESPACE } from './symbols';
import metadata from './metadata';
/**
 * 获得 dva model
 * @param Class
 */
export function getModel(Class) {
    return metadata.get(MODEL, Class.prototype);
}
/**
 * 获得 dva namespace
 * @param Class
 */
export function getNamespaceByInstance(instance) {
    return metadata.get(NAMESPACE, Reflect.getPrototypeOf(instance));
}
//# sourceMappingURL=utils.js.map