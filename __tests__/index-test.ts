import 'babel-polyfill';
import TestModel from './models/TestModel';
import TestModel2 from './models/TestModel2';
import { getModel, modelsContainer } from '../src';
import dva from 'dva';

it('class model snapshot', () => {
    const model = getModel(TestModel);
    expect(model).toMatchSnapshot();
});

it('class model function dispatch', () => {
    const testModel = new TestModel();
    const testModel2 = new TestModel2();

    modelsContainer.put({
        test: testModel,
        test2: testModel2,
    });

    const app = dva({
        namespacePrefixWarning: false,
    });
    app.model(getModel(TestModel));
    app.model(getModel(TestModel2));
    app.router(() => null as any);
    app.start();

    expect(testModel.getState()).toEqual({
        state: { a: 1, age: 1, base: '12123123', message: '', name: 'initialName' },
        mode: 'mode',
    });

    const dispatch = (app as any)._store.dispatch;
    const content = 'content';
    dispatch(testModel.fetchContent(content)).then((result) => {
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
    }).then((result) => {
        expect(result).toEqual({
            state: { name: 'initialName2', a: 1, age: 2, base: '12123123', message: '2', content: content2 },
            setContentAction: {
                type: 'test2/setContent',
                payload: [content2],
            },
        });
    });
});

it('class model function return', () => {
    const testModel = new TestModel();

    expect(testModel.setName('name')).toEqual({
        payload: ['name'],
        type: 'test/setName',
    });
    expect(
        testModel.setState({
            name: 'setStateName',
            age: 2,
        }),
    ).toEqual({
        payload: [
            {
                name: 'setStateName',
                age: 2,
            },
        ],
        type: 'test/setState',
    });
    expect(testModel.handleMessage('messageName', 3)).toEqual({
        payload: ['messageName', 3],
        type: 'test/handleMessage',
    });
});
