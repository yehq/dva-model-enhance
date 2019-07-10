import { EffectsCommandMap as DvaEffectsCommandMap } from 'dva';
import { reducer, dvaModel } from '../../../src';

export interface EffectsCommandMap extends DvaEffectsCommandMap {
    put: any;
    call: any;
}

@dvaModel({
    state: {},
})
class BaseModel<T extends object> {
    effects!: EffectsCommandMap;
    state!: T;

    @reducer
    setState(state: Partial<T>) {
        return {
            ...this.state,
            ...state,
        };
    }
}

export default BaseModel;
