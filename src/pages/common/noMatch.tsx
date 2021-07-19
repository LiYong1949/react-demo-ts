import React from 'react';
import { Empty } from 'antd';

const NoMatch = (props: any) => {

 return (
    <div style={{paddingTop: '5%'}}>
      <Empty description={<span className="d-text-gray">当前访问路径不存在！</span>} />
    </div>
  );
};

export default NoMatch;
