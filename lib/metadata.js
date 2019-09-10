export default {
    define: function (key, value, target) {
        Reflect.defineProperty(target, key, {
            value: value,
            enumerable: false,
            writable: true,
            configurable: true,
        });
    },
    get: function (key, target) {
        return target[key];
    },
    has: function (key, target) {
        return Object.prototype.hasOwnProperty.call(target, key);
    },
};
//# sourceMappingURL=metadata.js.map