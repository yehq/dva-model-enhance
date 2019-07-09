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
