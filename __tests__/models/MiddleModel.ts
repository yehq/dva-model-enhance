import { effect, reducer, dvaModel } from '../../src';
import BaseModel from './BaseModel';

@dvaModel({
    state: {},
})
class MiddleModel<T extends object> extends BaseModel<T> {
    @effect()
    *fetchContent(content: string) {
        yield this.effects.put(this.setContent(content));
        return {
            state: this.state,
            setContentAction: this.setContent(content),
        };
    }

    @reducer
    setContent(content: string) {
        return {
            ...this.state,
            content,
        };
    }
}

export default MiddleModel;
