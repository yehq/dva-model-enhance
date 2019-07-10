import TestModel from './models/TestModel';
import { getModel } from '../src';
import dva from 'dva';

it('class model snapshot', () => {
    const model = getModel(TestModel);
    expect(model).toMatchSnapshot();
});

it('class model function dispatch', () => {
    const testModel = new TestModel();
    const model = getModel(TestModel);
    const app = dva({
        namespacePrefixWarning: false,
    });
    app.model(model);
    app.router(() => null);
    app.start();
    const dispatch = (app as any)._store.dispatch;
    const content = 'content';
    dispatch(testModel.fetchContent(content)).then((result) => {
        expect(result).toEqual({
            state: { name: 'initialName', age: 1, message: '', content },
            setContentAction: {
                type: 'test/setContent',
                payload: [content],
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
