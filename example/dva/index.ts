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
