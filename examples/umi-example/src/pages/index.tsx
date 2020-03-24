import { Link } from 'umi';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '@/hooks';
import styles from './index.less';

export default () => {
  const dispatch = useDispatch();
  const test = useSelector(state => state.test);

  useEffect(() => {
    console.log(test, 'state');
    dispatch.test.initCount();
  }, []);

  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      {test.count}
      <button
        onClick={() => {
          dispatch.test.addCount();
        }}
      >
        click
      </button>
      <Link to={'/test'}>
        <button>test page</button>
      </Link>
    </div>
  );
};
