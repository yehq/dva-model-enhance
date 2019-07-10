import { effect, reducer, dvaModel } from '../../src';
import MiddleModel from './MiddleModel';

@dvaModel({
    state: {},
})
class SecondModel<T extends object> extends MiddleModel<T> {}

export default SecondModel;
