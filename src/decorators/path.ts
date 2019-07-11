import 'reflect-metadata';
import { SubscriptionOptions, SubscriptionPath } from '../interfaces';
import { PATH } from '../symbols';

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
