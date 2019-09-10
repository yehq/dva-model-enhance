import { DvaInstance } from 'dva';
interface Config {
    models: () => PromiseLike<any>[];
    app: DvaInstance;
    component: () => PromiseLike<any>;
}
export default function ({ models: resolveModels, app, component: resolveComponent }: Config): Promise<unknown>;
export {};
