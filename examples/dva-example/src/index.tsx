import React from 'react';
import dva, { DvaInstance } from 'dva';
import { getModel } from 'dva-model-enhance';
import './index.css';
import App from './App';
import Test from './models/test';
import * as H from 'history';
import * as serviceWorker from './serviceWorker';

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
