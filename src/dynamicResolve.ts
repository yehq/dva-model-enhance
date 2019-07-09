import { DvaInstance } from 'dva';

interface Config {
    models: () => PromiseLike<any>[];
    app: DvaInstance;
    component: () => PromiseLike<any>;
}

const cached: { [key: string]: boolean } = {};
function registerModel(app: DvaInstance, model: any) {
    model = model.default || model;
    if (model.prototype && model.prototype.$$modelInfo) {
        model = model.prototype.$$modelInfo;
    }
    if (!cached[model.namespace]) {
        app.model(model);
        cached[model.namespace] = true;
    }
}

export default function({ models: resolveModels, app, component: resolveComponent }: Config) {
    const models = typeof resolveModels === 'function' ? resolveModels() : [];
    const component = resolveComponent();
    return new Promise((resolve) => {
        Promise.all([...models, component]).then((ret) => {
            if (!models || !models.length) {
                return resolve(ret[0]);
            } else {
                const len = models.length;
                ret.slice(0, len).forEach((m) => {
                    m = m.default || m;

                    if (m.prototype && m.prototype.$$modelInfo) {
                        m = m.prototype.$$modelInfo;
                    }

                    if (!Array.isArray(m)) {
                        m = [m];
                    }
                    m.map((_: any) => registerModel(app, _));
                });
                resolve(ret[len]);
            }
        });
    });
}
