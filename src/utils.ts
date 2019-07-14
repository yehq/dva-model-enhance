import 'reflect-metadata';
import { MODEL, NAMESPACE } from './symbols';

/**
 * 获得 dva model
 * @param Class
 */
export function getModel(Class: { new (): any }) {
    return Reflect.getMetadata(MODEL, Class.prototype);
}

/**
 * 获得 dva namespace
 * @param Class
 */
export function getNamespaceByInstance(instance: any) {
    return Reflect.getMetadata(NAMESPACE, Reflect.getPrototypeOf(instance));
}
