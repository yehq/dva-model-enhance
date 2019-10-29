import { getNamespaceByInstance } from './utils';

const container = new Map();

export default {
    set(key: string, value: object) {
        const namespace = getNamespaceByInstance(value);
        if (key !== namespace) {
            const className = Reflect.getPrototypeOf(value).constructor.name;
            console.warn(`modelsContainer.set(${key}, ${className}), key must be ${namespace}`);
        }
        return container.set(namespace, value);
    },
    put(models: { [namespace: string]: object }) {
        Object.keys(models).map(key => {
            this.set(key, models[key]);
        });
    },
    get(namespace: string) {
        if (typeof namespace === 'undefined') {
            return container;
        }
        if (!container.has(namespace)) {
            console.warn(`the key of '${namespace}' does not exist in modelsContainer`);
        }
        return container.get(namespace);
    },
    has(namespace: string) {
        const has = container.has(namespace);
        if (has) {
            console.warn(`${namespace} is existed`);
        }
        return has;
    },
};
