import SecondModel from './SecondModel';
import { reducer, effect, dvaModel } from '../../src';

export interface TestModel2State {
    name: string;
    age: number;
    message: string;
}

@dvaModel<TestModel2State>({
    namespace: 'test2',
    state: {
        name: 'initialName2',
        age: 2,
        message: '2',
    },
})
class TestModel2 extends SecondModel<TestModel2State> {
    @effect()
    *handleMessage2(name: string, age: number) {
        yield this.effects.put(
            this.setState({
                name,
                age,
            })
        );
    }

    @reducer
    setName2(name: string) {
        return {
            ...this.state,
            name,
        };
    }
}

export default TestModel2;
