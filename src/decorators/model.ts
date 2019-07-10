import 'reflect-metadata';
import modelExtend from 'dva-model-extend';
import { DvaModelOptions } from '../interfaces';
import { NAMESPACE, MODEL, EFFECTS, REDUCERS } from '../symbols';

function model(dvaModelOptions: DvaModelOptions) {
    const { namespace, state = {} } = dvaModelOptions;
    return (target: Function) => {
        Reflect.defineMetadata(NAMESPACE, namespace, target.prototype);
        const effects = Reflect.getMetadata(EFFECTS, target.prototype);
        const reducers = Reflect.getMetadata(REDUCERS, target.prototype);
        const model = {
            namespace,
            state,
            effects,
            reducers,
        };
        const parentProto = Reflect.getPrototypeOf(target.prototype) as any;

        if (parentProto.constructor.name !== 'Object' && Reflect.hasMetadata(MODEL, parentProto)) {
            // 继承 model
            Reflect.defineMetadata(MODEL, modelExtend(Reflect.getMetadata(MODEL, parentProto), model), target.prototype);
        } else {
            Reflect.defineMetadata(MODEL, model, target.prototype);
        }
    };
}

export default model;
