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
import { useDispatch as useDvaDispatch } from 'dva';
/**
 * 使用 Proxy 代理 actions 用来增强 useDispatch 返回的 dispatch
 * 使用 dispatch.test.add() 的形式 代替 dispatch(actions.test.add()) 的方式来调用;
 */
var useDispatch = function (actions) {
    var dispatch = useDvaDispatch();
    if (actions) {
        Object.keys(actions).forEach(function (key) {
            dispatch[key] = new Proxy({}, {
                get: function (_, paraKey) {
                    return function () {
                        var _a;
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return dispatch((_a = actions[key])[paraKey].apply(_a, __spread(args)));
                    };
                },
            });
        });
    }
    return dispatch;
};
export default useDispatch;
//# sourceMappingURL=useDispatch.js.map