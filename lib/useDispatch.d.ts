import { Dispatch } from 'redux';
interface BaseDispatchContent {
    [key: string]: {
        [name: string]: any | Function;
    };
}
export declare type OutDispatchContent<T extends BaseDispatchContent> = {
    [P in keyof T]: {
        [U in keyof T[P]]: T[P][U] extends (...args: any[]) => Generator<any, infer RT, any> ? (...args: Parameters<T[P][U]>) => Promise<RT> : (...args: Parameters<T[P][U]>) => void;
    };
};
export declare type OutDispatch<T extends BaseDispatchContent> = {
    <TDispatch extends Dispatch>(...args: Parameters<TDispatch>): ReturnType<TDispatch>;
} & OutDispatchContent<T>;
/**
 * 使用 Proxy 代理 actions 用来增强 useDispatch 返回的 dispatch
 * 使用 dispatch.test.add() 的形式 代替 dispatch(actions.test.add()) 的方式来调用;
 */
declare const useDispatch: <T extends BaseDispatchContent = any>(actions?: {
    [key: string]: any;
} | undefined) => OutDispatch<T>;
export default useDispatch;
