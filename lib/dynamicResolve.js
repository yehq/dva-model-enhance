var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var cached = {};
function registerModel(app, model) {
    model = model.default || model;
    if (model.prototype && model.prototype.$$modelInfo) {
        model = model.prototype.$$modelInfo;
    }
    if (!cached[model.namespace]) {
        app.model(model);
        cached[model.namespace] = true;
    }
}
export default function (_a) {
    var resolveModels = _a.models, app = _a.app, resolveComponent = _a.component;
    var models = typeof resolveModels === 'function' ? resolveModels() : [];
    var component = resolveComponent();
    return new Promise(function (resolve) {
        Promise.all(__spread(models, [component])).then(function (ret) {
            if (!models || !models.length) {
                return resolve(ret[0]);
            }
            else {
                var len = models.length;
                ret.slice(0, len).forEach(function (m) {
                    m = m.default || m;
                    if (m.prototype && m.prototype.$$modelInfo) {
                        m = m.prototype.$$modelInfo;
                    }
                    if (!Array.isArray(m)) {
                        m = [m];
                    }
                    m.map(function (_) { return registerModel(app, _); });
                });
                resolve(ret[len]);
            }
        });
    });
}
//# sourceMappingURL=dynamicResolve.js.map