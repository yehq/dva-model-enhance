import 'babel-polyfill';
import dva from 'dva';
import { modelsContainer, setConfig } from '../src';

const app = dva({
    namespacePrefixWarning: false,
});
app.router(() => null as any);
app.start();
setConfig({
    autoAddModel: true,
    addModel: model => {
        app.model(model);
    },
});

import TestModel from './models/TestModel';
import TestModel2 from './models/TestModel2';

it('class model function dispatch', () => {
    const testModel = new TestModel();
    const testModel2 = new TestModel2();

    modelsContainer.put({
        test: testModel,
        test2: testModel2,
    });

    expect(testModel.getState()).toEqual({
        state: { a: 1, age: 1, base: '12123123', message: '', name: 'initialName' },
        mode: 'mode',
    });

    const dispatch = (app as any)._store.dispatch;
    const content = 'content';
    dispatch(testModel.fetchContent(content)).then(result => {
        expect(result).toEqual({
            state: { a: 1, age: 1, base: '12123123', content, message: '', name: 'initialName' },
            setContentAction: {
                type: 'test/setContent',
                payload: [content],
            },
        });
    });

    const content2 = 'content2';
    dispatch({
        type: 'test2/fetchContent',
        payload: [content2],
    }).then(result => {
        expect(result).toEqual({
            state: {
                name: 'initialName2',
                a: 1,
                age: 2,
                base: '12123123',
                message: '2',
                content: content2,
            },
            setContentAction: {
                type: 'test2/setContent',
                payload: [content2],
            },
        });
    });
});
