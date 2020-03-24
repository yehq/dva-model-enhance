/**
 * 添加了一个 dva model 用于开启 @umijs/plugin-dva 插件
 * 插件内部判断 没有 符合条件的 model 时 不启用 dva 相关功能
 */
export default {
  namespace: '__enableDva',
  state: {},
};
