import React from 'react';
import styles from './index.css';
import { Link } from 'dva/router';
import { Button } from 'antd';

export default function() {
  return (
    <div className={styles.normal}>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>
          To get started, edit <code>src/pages/index.js</code> and save to reload.
        </li>
        <li>
          <Link to={'/test'}>
            <Button>test</Button>
          </Link>
        </li>
      </ul>
    </div>
  );
}
