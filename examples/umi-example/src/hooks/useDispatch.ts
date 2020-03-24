import { actions } from 'umi';
import { useDispatch as useEnhanceDispatch } from 'dva-model-enhance';

export default () => useEnhanceDispatch(actions);
