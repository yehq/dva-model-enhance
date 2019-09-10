declare const _default: {
    set(key: string, value: object): Map<any, any>;
    put(models: {
        [namespace: string]: object;
    }): void;
    get(namespace: string): any;
    has(namespace: string): boolean;
};
export default _default;
