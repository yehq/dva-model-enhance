import { useDispatch as useEnhanceDispatch } from 'dva-model-enhance';
import actions from '../actions';

const useDispatch = () => {
    return useEnhanceDispatch(actions);
};

export default useDispatch;
