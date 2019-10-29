import { getNamespaceByInstance } from './utils';
var container = new Map();
export default {
    set: function (key, value) {
        var namespace = getNamespaceByInstance(value);
        if (key !== namespace) {
            var className = Reflect.getPrototypeOf(value).constructor.name;
            console.warn("modelsContainer.set(" + key + ", " + className + "), key must be " + namespace);
        }
        return container.set(namespace, value);
    },
    put: function (models) {
        var _this = this;
        Object.keys(models).map(function (key) {
            _this.set(key, models[key]);
        });
    },
    get: function (namespace) {
        if (typeof namespace === 'undefined') {
            return container;
        }
        if (!container.has(namespace)) {
            console.warn("the key of '" + namespace + "' does not exist in modelsContainer");
        }
        return container.get(namespace);
    },
    has: function (namespace) {
        var has = container.has(namespace);
        if (has) {
            console.warn(namespace + " is existed");
        }
        return has;
    },
};
//# sourceMappingURL=modelsContainer.js.map