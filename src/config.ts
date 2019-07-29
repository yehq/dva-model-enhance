import { Config } from './interfaces';

const config: Config = {
    autoAddModel: false,
    addModel: () => {
        console.warn(`Please set addModel function. 
exmaple: 
    setConfig({
        autoAddModel: true,
        addModel: (model) => app.model(model) 
    })
or
    setConfig({
        autoAddModel: false,
    })
        `);
    },
};

export const setConfig = (cfg: Partial<Config>) => {
    for (const key in cfg) {
        if (config.hasOwnProperty(key)) {
            (config as any)[key] = cfg[key as keyof Config];
        }
    }
};

export default config;
