import TestModel from './models/TestModel';

it('class model', () => {
    const testModel = new TestModel();
    const prototype = Reflect.getPrototypeOf(testModel) as any;
    const modelInfo = prototype.$$modelInfo;
    expect(modelInfo).toMatchSnapshot();
});

it('class model properties', () => {
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
