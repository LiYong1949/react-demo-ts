import React from 'react';
import { Empty } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Home = (props: any) => {

 const { type, data, mode = 'result', style = {} } = props;
 let marginTop: (string | number) = 0;

  switch(type) {
    case 'loading':
      marginTop = 0;
    break;
    case 'tips':
      marginTop = '5%';
    break;
  default:
    break;
  }

  return (
    <div style={{ marginTop, ...style}}>

      {
        mode === 'result' ?
          <Empty description={<span className="d-text-gray">{data}</span>} />
        :
          <div className="d-text-gray" style={{textAlign:'center'}}>
            <LoadingOutlined /> {data}
          </div>
      }

    </div>
  );
};

export default Home;
