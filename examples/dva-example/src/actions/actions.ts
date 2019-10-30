import { modelsContainer } from 'dva-model-enhance';
import Test from '../models/test';

const actions = {
    test: new Test(),
};

modelsContainer.put(actions);

export default actions;
