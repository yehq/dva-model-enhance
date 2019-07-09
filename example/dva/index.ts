import dva from 'dva';
import TestModel from './models/TestModel';

const app = dva({
    namespacePrefixWarning: false, // 取消 dva 的警告
});
(window as any).dvaApp = app;

app.use((TestModel.prototype as any).$$modelInfo); // 加载 dva model
