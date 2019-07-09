import { EffectsCommandMap as DvaEffectsCommandMap } from 'dva';
import { reducer } from '../../../src';

export interface EffectsCommandMap extends DvaEffectsCommandMap {
    put: any;
    call: any;
}

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
