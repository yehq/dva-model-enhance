import { EffectType, Model } from 'dva';
import { Location, Action } from 'history';
import { match } from 'react-router';
import { Dispatch } from 'redux';
export interface DvaModelOptions {
    namespace?: string;
    state?: any;
    stateKey?: string;
}
export interface EffectOptions {
    type: EffectType;
    ms?: number;
}
export interface SubscriptionOptions {
    strict?: boolean;
    exact?: boolean;
    sensitive?: boolean;
}
export interface SubscriptionPath {
    url: string;
    options?: SubscriptionOptions;
    listener: (matchResult: match<any>, dispatch: Dispatch, location: Location, action: Action) => void;
}
export interface Config {
    autoAddModel: boolean;
    addModel: (model: Model) => void;
}
