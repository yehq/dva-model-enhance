/*
 * @Author: yehq
 * @Date: 2019-10-24 16:02:53
 * @Last Modified by: yehq
 * @Last Modified time: 2020-03-24 12:36:06
 */

import { StoreState } from 'umi';
import {
  effect,
  reducer,
  dvaModel,
  subscription,
  path,
  BaseModel,
} from 'dva-model-enhance';
import { match } from 'dva/router';
import { Dispatch } from 'redux';
import { Location, Action } from 'history';
import { SubscriptionAPI } from 'dva';
import { TestLocalState } from './types';

export interface TestState extends TestLocalState {}

@dvaModel<TestLocalState>({
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
      }),
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
  private subscriptionTest({ history, dispatch }: SubscriptionAPI) {
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
  private pathTest(
    matchResult: match<{ id?: string }>,
    dispatch: Dispatch,
    location: Location,
    action: Action,
  ) {
    console.log('route parameters', matchResult);
  }
}
export default Test;
