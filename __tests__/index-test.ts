import 'babel-polyfill';
import TestModel from './models/TestModel';
import { getModel } from '../src';

it('class model snapshot', () => {
    const model = getModel(TestModel);
    expect(model).toMatchSnapshot();
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
        })
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
