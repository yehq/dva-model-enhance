declare function reducer(target: any, propertyKey: string, descriptor: PropertyDescriptor): {
    value: (...args: any[]) => any;
    configurable?: boolean | undefined;
    enumerable?: boolean | undefined;
    writable?: boolean | undefined;
};
export default reducer;
