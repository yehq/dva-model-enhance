declare function reducer(target: any, propertyKey: string, descriptor: PropertyDescriptor): {
    value: (...args: any[]) => any;
    configurable?: boolean | undefined;
    enumerable?: boolean | undefined;
    writable?: boolean | undefined;
    get?(): any;
    set?(v: any): void;
};
export default reducer;
