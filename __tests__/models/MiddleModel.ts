import { effect, reducer, dvaModel, BaseModel } from '../../src';

@dvaModel({
    state: {
        base: '12123123',
    },
})
class MiddleModel<T extends object> extends BaseModel<T, any> {
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
