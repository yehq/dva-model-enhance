import { EffectType } from 'dva';

export interface DvaModelOptions {
    // dva model namespace
    namespace?: string;
    // dva model state
    state?: any;
}

export interface EffectOptions {
    type: EffectType;
    // 当 type 为 throttle 时使用，设置节流时间
    ms?: number;
}

export interface SubscriptionOptions {
    path?: string;
    strict?: boolean; // 当为true时，在确定位置是否与当前url匹配时，将考虑位置路径名上的尾部斜线
    exact?: boolean; // 当为true时，仅当url完全匹配
}
