import 'reflect-metadata';
import { SubscriptionOptions } from '../interfaces';
import { PATH } from '../symbols';

export function subscription(options?: SubscriptionOptions) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (options && options.path) {
            Reflect.defineMetadata(
                PATH,
                {
                    path: options.path,
                    func: descriptor.value,
                },
                target,
            );
        }
    };
}
