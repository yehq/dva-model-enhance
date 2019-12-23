import { IConfig } from 'umi-types';

const isDev = process.env.NODE_ENV === 'development';

// ref: https://umijs.org/config/
const config: IConfig = {
  alias: {
    // 在 production 环境将采用 .umi-production 文件而不是 .umi，添加 alias 防止 production 环境 build 出错
    '@/pages/.umi': isDev ? '@/pages/.umi' : '@/pages/.umi-production',
  },
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        { path: '/', component: '../pages/index' },
        { path: '/test', component: '../pages/Test/index' },
        { path: '/test/:id', component: '../pages/Test/index' },
      ],
    },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: false,
        dynamicImport: { webpackChunkName: true },
        title: 'umi-example',
        dll: true,

        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
    [
      'umi-plugin-dva-enhance',
      {
        immer: true,
        dynamicImport: true,
      },
    ],
  ],
};

export default config;
