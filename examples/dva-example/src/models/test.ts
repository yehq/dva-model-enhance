/*
 * @Author: yehq
 * @Date: 2019-10-24 16:02:53
 * @Last Modified by: yehq
 * @Last Modified time: 2019-10-30 10:53:50
 */

import { IState } from './types';
import { effect, reducer, dvaModel, subscription, path, BaseModel } from 'dva-model-enhance';
import StoreState from '../StoreState';
import { SubscriptionAPI } from 'dva';
import { match } from 'react-router';
import { Dispatch } from 'redux';
import { Location, Action } from 'history';

export interface TestState extends IState {}

@dvaModel<TestState>({
    namespace: 'test',
    state: {
        count: 0,
    },
})
class Test extends BaseModel<TestState, StoreState> {
    @effect()
    *initCount() {
        const result = yield this.effects.call(() => Promise.resolve(100));
        yield this.effects.put(
            this.setState({
                count: result,
            })
        );
    }

    @reducer
    addCount() {
        return {
            ...this.state,
            count: this.state.count + 1,
        };
    }

    /**
     * dva subscription
     */
    @subscription
    subscriptionTest({ history, dispatch }: SubscriptionAPI) {
        history.listen((location, action) => {
            console.log('route change');
        });
    }

    /**
     * 当 路由 匹配时触发,
     * matchResult: 匹配的参数和路径
     * dispatch: redux dispatch
     */
    @path('/test/:id')
    pathTest(
        matchResult: match<{ id?: string }>,
        dispatch: Dispatch,
        location: Location,
        action: Action
    ) {
        console.log('route parameters', matchResult);
    }
}
export default Test;
