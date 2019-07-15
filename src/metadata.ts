export default {
    define(key: symbol, value: any, target: any) {
        Reflect.defineProperty(target, key, {
            value,
            enumerable: false,
            writable: true,
            configurable: true,
        });
    },
    get(key: symbol, target: any) {
        return target[key];
    },
    has(key: symbol, target: any) {
        return Object.prototype.hasOwnProperty.call(target, key);
    },
};
