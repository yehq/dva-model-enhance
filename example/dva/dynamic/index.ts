import dynamic from 'dva/dynamic';
import dynamicResolve from '../../../src/dynamicResolve';

const DynamicComponent = dynamic({
    resolve: () =>
        dynamicResolve({
            models: () => [import('../models/TestModel')],
            app: (window as any).dvaApp,
            component: () => import('./Dy'),
        }),
} as any);

export default DynamicComponent;
