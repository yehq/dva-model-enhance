import { defineConfig } from 'umi';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  routes: [
    {
      path: '/',
      routes: [
        { path: '/', component: '../pages/index' },
        { path: '/test', component: '../pages/test/index' },
        { path: '/test/:id', component: '../pages/test/index' },
      ],
    },
  ],
});
