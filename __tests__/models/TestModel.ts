import SecondModel from './SecondModel';
import {
    reducer,
    effect,
    dvaModel,
    state,
    // path,
    //  subscription
} from '../../src';
// import { SubscriptionAPI } from 'dva';
// import { match } from 'react-router';
// import { Dispatch } from 'redux';
// import { Location, Action } from 'history';

export interface TestModelState {
    name: string;
    age: number;
    message: string;
}

@dvaModel({
    namespace: 'test',
})
class TestModel extends SecondModel<TestModelState> {
    @state({
        name: 'initialName',
        age: 1,
        message: '',
    })
    state!: TestModelState;

    mode;

    getState() {
        return {
            state: this.state,
            mode: this.mode,
        };
    }

    constructor() {
        super();
        this.mode = 'mode';
    }

    // @subscription
    // subscriptionTest({ history, dispatch }: SubscriptionAPI) {
    //     dispatch(
    //         this.setState({
    //             message: 'new message',
    //         }),
    //     );
    // }

    // @path('/test/:id')
    // pathTest(matchResult: match<{ id?: string }>, dispatch: Dispatch, location: Location, action: Action) {
    //     console.log(this.mode, this.state, 111);
    // }

    @effect()
    *handleMessage(name: string, age: number) {
        console.log(this.mode, 'mode111');
        yield this.effects.put(
            this.setState({
                name,
                age,
            }),
        );
    }

    @reducer
    setName(name: string) {
        return {
            ...this.state,
            name,
        };
    }
}

export default TestModel;
