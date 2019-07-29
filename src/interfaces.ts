import { EffectType, Model } from 'dva';
import { Location, Action } from 'history';
import { match } from 'react-router';
import { Dispatch } from 'redux';

export interface DvaModelOptions {
    // dva model namespace
    namespace?: string;
    // dva model state
    state?: any;
    // dva model state key
    stateKey?: string;
}

export interface EffectOptions {
    type: EffectType;
    // 当 type 为 throttle 时使用，设置节流时间
    ms?: number;
}

export interface SubscriptionOptions {
    strict?: boolean; // 当为true时，在确定位置是否与当前url匹配时，将考虑位置路径名上的尾部斜线
    exact?: boolean; // 当为true时，仅当url完全匹配
    sensitive?: boolean;
}

export interface SubscriptionPath {
    url: string;
    options?: SubscriptionOptions;
    listener: (
        matchResult: match<any>,
        dispatch: Dispatch,
        location: Location,
        action: Action
    ) => void;
}

export interface Config {
    // 使用 model 修饰器的 class 是否自动设置 dva model
    autoAddModel: boolean;
    // autoAddModel 为 true 时，在 @model 中会自动调用 addModel 加载 model
    addModel: (model: Model) => void;
}
