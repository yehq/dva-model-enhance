## install

```
npm install dva-model-enhance
```

## use in dva

#### 1、定义基本的 model class

```
// ./example/dva/models/BaseModel.ts
import { EffectsCommandMap as DvaEffectsCommandMap } from 'dva';
import { reducer, dvaModel } from '../../../src';

export interface EffectsCommandMap extends DvaEffectsCommandMap {
    put: any;
    call: any;
}
@dvaModel({})
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

```

#### 2、业务 model 继承 基本 model

```
// ./example/dva/models/TestModel.ts
import BaseModel from './BaseModel';
import { reducer, effect, dvaModel, subscription, path } from '../../../src';
import { SubscriptionAPI } from 'dva';
import { Dispatch } from 'redux';
import { Action } from 'history';
import { match } from 'react-router';

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
class TestModel extends BaseModel<TestModelState> {
    @effect()
    *handleMessage(name: string, age: number) {
        yield this.effects.put(
            this.setState({
                name,
                age,
            }),
        );
    }

    /**
     * dva subscription
     */
    @subscription
    subscriptionTest({ history, dispatch }: SubscriptionAPI) {}

    /**
     * 当 路由 匹配时触发,
     * matchResult: 匹配的参数和路径
     * dispatch: redux dispatch
     */
    @path('/test/:id')
    pathTest(matchResult: match<{ id?: string }>, dispatch: Dispatch, location: Location, action: Action) {}

    @reducer
    setName(name: string) {
        return {
            ...this.state,
            name,
        };
    }
}

export default TestModel;

```

#### 3、统一加载 model 实例

```
// ./example/dva/actions.ts
import TestModel from './models/TestModel';

export default {
    test: new TestModel(),
};

```

#### 4、dva app 加载 model

```
// ./example/dva/index.ts
import dva from 'dva';
import TestModel from './models/TestModel';
import { getModel, modelsContainer } from '../../src';
import actions from './actions';

const app = dva({
    namespacePrefixWarning: false, // 取消 dva 的警告
});
(window as any).dvaApp = app;

// 加载所有实例 用来动态设置 所有 model function 的 this 指向，根据namespace来匹配实例
modelsContainer.put(actions);
app.use(getModel(TestModel)); // 加载 dva model


```

#### 5、使用 class function 替代 dva action，获得类型约束

```
// ./example/dva/components/TestCom.tsx
import React from 'react';
import { connect } from 'dva';
import { TestModelState } from '../models/TestModel';
import actions from '../actions';

class TestCom extends React.Component<any> {
    handleClick = () => {
        /**
         * 相当于：
         *
         * this.props.dispatch({
         *     type: 'test/handleMessage',
         *     payload: ['name', 2],
         * });
         */
        this.props.dispatch(actions.test.handleMessage('name', 2));
    };
    render() {
        return <div onClick={this.handleClick}>click</div>;
    }
}
export default connect((state: { test: TestModelState }) => ({
    name: state.test.name,
    age: state.test.age,
}))(TestCom);

```
