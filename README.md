## install

```
npm install dva-model-enhance
```

## use in dva

#### 1、定义基本的 model class

```ts
// ./example/dva/models/BaseModel.ts
import { EffectsCommandMap as DvaEffectsCommandMap } from 'dva';
import { reducer, dvaModel } from 'dva-model-enhance';

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

```ts
// ./example/dva/models/TestModel.ts
import BaseModel from './BaseModel';
import { reducer, effect, dvaModel, subscription, path } from 'dva-model-enhance';
import { SubscriptionAPI } from 'dva';
import { Dispatch } from 'redux';
import { Action } from 'history';
import { match } from 'react-router';

export interface TestModelState {
    name: string;
    age: number;
    message: string;
}

@dvaModel<TestModelState>({
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
            })
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
    pathTest(
        matchResult: match<{ id?: string }>,
        dispatch: Dispatch,
        location: Location,
        action: Action
    ) {}

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

```ts
// ./example/dva/actions.ts
import TestModel from './models/TestModel';

export default {
    test: new TestModel(),
};
```

#### 4、dva app 加载 model

```ts
// ./example/dva/index.ts
import dva from 'dva';
import TestModel from './models/TestModel';
import { getModel, modelsContainer } from 'dva-model-enhance';
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

```ts
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

#### 6、config

```ts
import dva from 'dva';
import { setConfig } from 'dva-model-enhance';

const app = dva({
    namespacePrefixWarning: false,
});
/**
 * 设置 autoAddModel 为 true 后，不需要 app.use(model) 手动加载 model
 * 同时请确保 setConfig 方法 在 model 的 decorator 执行之前调用。 比如 下面, 延迟 加载 "./App" 与 "./actions"
 */
setConfig({
    autoAddModel: true,
    addModel: model => {
        app.model(model);
    },
});
app.router(() => {
    const App = require('./App').default;
    return <App></App>;
});
app.start('#root');
const actions = require('./actions').default;
modelsContainer.put(actions);
```

| 字段         | 类型                   | 必填 | 默认值 | 描述                                                                            |
| ------------ | ---------------------- | ---- | ------ | ------------------------------------------------------------------------------- |
| autoAddModel | boolean                | 否   | false  | 使用 model 修饰器的 class 是否自动设置 dva model, 为 true 时, 需要设置 addModel |
| addModel     | (model: Model) => void | 否   | -      | autoAddModel 为 true 时，在 @model 中会自动调用 addModel 加载 model             |

#### 7、useDispatch

```ts
import { useDispatch as useEnhanceDispatch } from 'dva-model-enhance';
import actions from '../actions';
/**
 * 使用 Proxy 代理 actions 用来增强 useDispatch 返回的 dispatch
 * 使用 dispatch.test.add() 的形式 代替 dispatch(actions.test.add()) 的方式来调用;
 */
const useDispatch = <T extends keyof typeof actions = keyof typeof actions>() => {
    return useEnhanceDispatch<Pick<typeof actions, T>>(actions) as any;
};

export default useDispatch;
```
