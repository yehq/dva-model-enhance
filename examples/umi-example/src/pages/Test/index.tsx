import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '@/hooks';
import { Button } from 'antd';
import { Link } from 'umi';

interface Props {}

const Page: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const { count } = useSelector(state => ({ count: state.test.count }));
  useEffect(() => {
    dispatch.test.initCount();
  }, []);
  return (
    <div>
      {count}
      <Button onClick={() => dispatch.test.addCount()}>add</Button>
      <Link to={'/test/121'}>
        <Button>change route</Button>
      </Link>

      <Link to={'/test'}>
        <Button>test</Button>
      </Link>
    </div>
  );
};

export default Page;
