import {
    take, cancel,
    // CallEffect, SelectEffect, PutEffect
} from 'redux-saga/effects';
import { State } from '@/types';

export interface Put {
    (action: any): any;
    resolve(action: any): Promise<any>;
}

export interface Select {
    <T = State>(fn: (state: T) => any): any;
}

export interface EffectsCommandMap {
    put: Put;
    call<Fn extends (...args: any[]) => any>(fn: Fn, ...args: Parameters<Fn>): any;
    select: Select;
    take: typeof take;
    cancel: typeof cancel;
    [key: string]: any;
}
