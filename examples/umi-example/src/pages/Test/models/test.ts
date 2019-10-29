/*
 * @Author: yehq
 * @Date: 2019-10-24 16:02:53
 * @Last Modified by: yehq
 * @Last Modified time: 2019-10-29 17:05:29
 */

import { IState } from './types.d';
import { effect, reducer, dvaModel, subscription, path } from 'dva-model-enhance';
import { BaseModel } from '@/utils/classModels';

export interface TestState extends IState {}

@dvaModel<TestState>({
  namespace: 'test',
  state: {
    count: 0,
  },
})
class Test extends BaseModel<TestState> {
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
    action: Action,
  ) {
    console.log('route parameters', matchResult);
  }
}
export default Test;
