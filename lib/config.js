var config = {
    autoAddModel: false,
    addModel: function () {
        console.warn("Please set addModel function. \nexmaple: \n    setConfig({\n        autoAddModel: true,\n        addModel: (model) => app.model(model) \n    })\nor\n    setConfig({\n        autoAddModel: false,\n    })\n        ");
    },
};
export var setConfig = function (cfg) {
    for (var key in cfg) {
        if (config.hasOwnProperty(key)) {
            config[key] = cfg[key];
        }
    }
};
export default config;
//# sourceMappingURL=config.js.map