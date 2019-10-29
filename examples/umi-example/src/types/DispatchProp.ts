import { AnyAction, Dispatch as ReduxDispatch } from 'redux';

export interface Action extends AnyAction {
    payload?: any;
    [key: string]: any;
}

type ActionFunction = (dispatch: ReduxDispatch, getState: any) => any;

export type Dispatch = (action: Action | ActionFunction | { [key: string]: any }) => Promise<any>;

export interface DispatchProp {
    dispatch(action: Action | ActionFunction | { [key: string]: any }): any;
}
