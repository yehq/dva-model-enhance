## install

```
npm install dva-model-enhance
or
yarn add dva-model-enhance
```

## use in dva

#### 1、业务 model 继承 基本 model

```ts
// ./examples/dva-example/src/models/test.ts
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
```

#### 2、实例化 class model，同时添加到 model 容器中

```ts
// ./examples/dva-example/src/actions/actions.ts
import { modelsContainer } from 'dva-model-enhance';
import Test from '../models/test';

const actions = {
    test: new Test(),
};

modelsContainer.put(actions);

export default actions;
```

#### 3、dva app 加载 model

```ts
// ./examples/dva-example/src/index.tsx
import React from 'react';
import dva, { DvaInstance } from 'dva';
import { getModel } from 'dva-model-enhance';
import './index.css';
import App from './App';
import Test from './models/test';
import * as H from 'history';

const app = dva({
    namespacePrefixWarning: false, // 取消 dva 的警告
});

app.model(getModel(Test)); // 加载 dva model

app.router(router => {
    if (!router) return {};
    const { history, app }: { history: H.History; app: DvaInstance } = router;
    return <App history={history} />;
});
app.start('#root');
```

#### 4、使用 class function 替代 dva action，获得类型约束

```ts
// ./examples/dva-example/App.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from './hooks';
import { Link, Router } from 'react-router-dom';
import * as H from 'history';

interface Props {
    history: H.History;
}

const App: React.FC<Props> = ({ history }) => {
    const count = useSelector(state => state.test.count);
    const dispatch = useDispatch();
    useEffect(() => {
        /**
         * 相当于：
         *
         * dispatch({
         *     type: 'test/initCount',
         *     payload: [],
         * });
         *
         * 也相当于
         * // import actions from './actions';
         * dispatch(
         *     actions.test.initCount()
         * );
         */
        dispatch.test.initCount();
        return () => {};
    }, []);
    return (
        <Router history={history}>
            count: {count}
            <button onClick={() => dispatch.test.addCount()}>add</button>
            <Link to={'/test/121'}>
                <button>change route</button>
            </Link>
            <Link to={'/test'}>
                <button>test</button>
            </Link>
        </Router>
    );
};

export default App;
```

#### 5、config (可以不设置)

```ts
import dva from 'dva';
import { setConfig } from 'dva-model-enhance';

const app = dva({
    namespacePrefixWarning: false,
});
/**
 * 设置 autoAddModel 为 true 后，不需要 app.use(model) 手动加载 model
 * 但是请确保 setConfig 方法 在 model 的 decorator 执行之前调用。 比如 下面, 延迟 加载 "./App" 与 "./actions"
 */
setConfig({
    autoAddModel: true,
    addModel: model => {
        app.model(model);
    },
});
```

| 字段         | 类型                   | 必填 | 默认值 | 描述                                                                            |
| ------------ | ---------------------- | ---- | ------ | ------------------------------------------------------------------------------- |
| autoAddModel | boolean                | 否   | false  | 使用 model 修饰器的 class 是否自动设置 dva model, 为 true 时, 需要设置 addModel |
| addModel     | (model: Model) => void | 否   | -      | autoAddModel 为 true 时，在 @model 中会自动调用 addModel 加载 model             |

#### 6、useDispatch

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

## umi

> 结合 umi 脚手架，自动加载 class 形式的 model，同时能够自动实例化 class 同时加载到 全局容器 modelsContainer 中。并且按照一定的约定，自动收集 class model 导出的 State 类型。参考例子 [umi-example](https://github.com/yehq/dva-model-enhance/tree/master/examples/umi-example)

需要搭配 [umi-plugin-dva-enhance](https://github.com/yehq/umi-plugin-dva-enhance) 使用，该插件 基于
[umi-plugin-dva](https://github.com/umijs/umi/tree/master/packages/umi-plugin-dva) 添加了对 dva-model-enhance 的支持。

在 umi 生成后的项目中

```
npm install dva-model-enhance
npm install umi-plugin-dva-enhance -D
```

添加 umi-plugin-dva-enhance 插件

```ts
// .umirc.ts
import { IConfig } from 'umi-types';

const isDev = process.env.NODE_ENV === 'development';

// ref: https://umijs.org/config/
const config: IConfig = {
    alias: {
        // 在 production 环境将采用 .umi-production 文件而不是 .umi，添加 alias 防止 production 环境 build 出错
        '@/pages/.umi': isDev ? '@/pages/.umi' : '@/pages/.umi-production',
    },
    treeShaking: true,
    routes: [],
    plugins: [
        [
            'umi-plugin-react',
            {
                antd: true,
                dva: false, // 关闭 umi-plugin-dva 插件
                dynamicImport: { webpackChunkName: true },
                title: 'umi-example',
                dll: true,
            },
        ],
        [
            'umi-plugin-dva-enhance', // 添加 umi-plugin-dva-enhance 插件
            {
                // 配置和 umi-plugin-dva 一致
                immer: true,
                dynamicImport: true,
            },
        ],
    ],
};

export default config;
```

添加插件后，在运行后的 ./src/pages/.umi 文件夹中会多生成 actions.ts 和 StoreState.ts 文件，它们会随着 全局 和 pages 下的 models 文件里面的 model 文件改变而改变。

-   actions.ts 自动加载所有的 class model 并实例化添加到 modelsContainer 中
-   StoreState.ts 自动加载所有的 class model 中对外导出的 State 类型。导出的类型名称为 文件名加 State 后缀。例子如下

```ts
import { TestState } from '/Users/yehangqi/Documents/work/web/dva-model-enhance/examples/umi-example/src/pages/Test/models/test';

export default interface StoreState {
    test: TestState;
}
```

在文件外部通过引入 ./src/pages/.umi/actions.ts 和 ./src/pages/.umi/StoreState.ts 完善功能

1. 添加增强的 useDispatch 文件，使得 dispatch 能直接访问 class model 中的方法和类型提示

```ts
import { useDispatch as useEnhanceDispatch } from 'dva-model-enhance';
import actions from './src/pages/.umi/actions';
export default useEnhanceDispatch<typeof actions>(actions);
```

2. 添加增强的 useSelector 文件, 使得 state 能具有类型提示和添加浅比较

```ts
import { useSelector as reactReduxUseSelector, shallowEqual } from 'react-redux';
import StoreState from './src/pages/.umi/StoreState';

export interface Selector<TState, TSelected> {
    (state: TState): TSelected;
}

const useSelector = <TState extends StoreState, TSelected>(
    selector: Selector<TState, TSelected>,
    equalityFn?: (left: TSelected, right: TSelected) => boolean
) => {
    return reactReduxUseSelector<TState, TSelected>(selector, equalityFn || shallowEqual);
};

export default useSelector;
```

### 支持 umi 的 dynamicImport

-   在 development 环境生成正常的 ./src/pages/.umi/actions 文件，带来类型提示。
    此时相当于全量引入，会造成 umi 中 model 按需加载失效。
-   在 production 环境生成生成的 actions 文件如下

```
import { modelsContainer } from 'dva-model-enhance';
import global from '@/models/global';

// 全局 models 直接实例化加载
const globalActions = {
	global: new global(),
};

modelsContainer.put(globalActions);

/**
 * production 模式下 全局和局部的 model 都走如下代理
 * 局部的 model 在动态加载时 根据路由加载页面时候 再同时实例化
 */
const actions = new Proxy(
    {
        test: {},
        global: {},
    },
    {
        get(t: object, p: string | number | symbol) {
            return new Proxy(
                {},
                {
                    get(target: {}, property: string | number | symbol) {
                        return (...args: any[]) => ({
                            type: `${p.toString()}/${property.toString()}`,
                            payload: args,
                        });
                    },
                },
            );
        },
    },
);

export default actions;
```

通过代理的方式将引用结果返回成普通的 redux action。同时取消对 class model 的直接引入，防止了对按需引入的破坏。
