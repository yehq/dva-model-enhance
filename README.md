## install

```
npm install dva-model-enhance
```

## use in dva

定义基本的 model class

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

业务 model 继承 基本 model

```
// ./example/dva/models/TestModel.ts
import BaseModel from './BaseModel';
import { reducer, effect, dvaModel } from '../../../src';

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

dva app 加载 model

```
// ./example/dva/index.ts
import dva from 'dva';
import TestModel from './models/TestModel';
import { getModel } from '../../src';

const app = dva({
    namespacePrefixWarning: false, // 取消 dva 的警告
});
(window as any).dvaApp = app;

app.use(getModel(TestModel)); // 加载 dva model

```

使用 class function 替代 dva action，获得类型约束

```
// ./example/dva/components/TestCom.tsx
import React from 'react';
import { connect } from 'dva';
import TestModel, { TestModelState } from '../models/TestModel';

const testModel = new TestModel();

class TestCom extends React.Component<any> {
    handleClick = () => {
        this.props.dispatch(testModel.handleMessage('name', 2));
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
