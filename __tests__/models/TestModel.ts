import SecondModel from './SecondModel';
import { reducer, effect, dvaModel, path, subscription } from '../../src';
import { SubscriptionAPI } from 'dva';
import { match } from 'react-router';
import { Dispatch } from 'redux';
import { Location, Action } from 'history';

export interface TestModelState {
    name: string;
    age: number;
    message: string;
}

@dvaModel({
    namespace: 'test',
    state: {
        name: 'initialName',
        age: 1,
        message: '',
    },
})
class TestModel extends SecondModel<TestModelState> {
    @subscription
    subscriptionTest({ history, dispatch }: SubscriptionAPI) {}

    @path('/test/:id')
    pathTest(matchResult: match<{ id?: string }>, dispatch: Dispatch, location: Location, action: Action) {}

    @effect()
    *handleMessage(name: string, age: number) {
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
