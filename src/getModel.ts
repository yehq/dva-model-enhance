import 'reflect-metadata';
import { MODEL } from './symbols';

/**
 * 获得 dva model
 * @param Class
 */
export default function(Class: { new (): any }) {
    return Reflect.getMetadata(MODEL, Class.prototype);
}
