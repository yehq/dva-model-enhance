import { dvaModel } from '../../src';
import MiddleModel from './MiddleModel';

@dvaModel({
    state: {
        a: 1,
    },
})
class SecondModel<T extends object> extends MiddleModel<T> {}

export default SecondModel;
