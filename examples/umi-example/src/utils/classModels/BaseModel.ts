import { EffectsCommandMap } from '@/types';
import { reducer, dvaModel } from 'dva-model-enhance';

@dvaModel({})
class BaseModel<T extends object> {
    protected effects!: EffectsCommandMap;
    protected state!: T;

    @reducer
    setState(state: Partial<T>) {
        return {
            ...this.state,
            ...state,
        };
    }
}

export default BaseModel;
