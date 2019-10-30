import { useDispatch as useEnhanceDispatch } from 'dva-model-enhance';
import actions from '../actions';

const useDispatch = <T extends keyof typeof actions = keyof typeof actions>() => {
  return useEnhanceDispatch<Pick<typeof actions, T>>(actions);
};

export default useDispatch;
