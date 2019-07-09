import React from 'react';
import { connect } from 'dva';
import TestModel from '../models/TestModel';

const testModel = new TestModel();

class Dy extends React.Component<any> {
    handleClick = () => {
        this.props.dispatch(testModel.handleMessage('name', 2));
    };
    render() {
        return <div onClick={this.handleClick}>dynamic</div>;
    }
}
export default connect()(Dy);
