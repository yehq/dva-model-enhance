import dva from 'dva';
import TestModel from './models/TestModel';
import { getModel } from '../../src';

const app = dva({
    namespacePrefixWarning: false, // 取消 dva 的警告
});
(window as any).dvaApp = app;

app.use(getModel(TestModel)); // 加载 dva model
