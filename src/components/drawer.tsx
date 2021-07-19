import React, { useState, useEffect } from 'react';
import { Drawer } from 'antd';

const Home = (props: any) => {

  const { title, isVisible, width, footer, children, callbackParent } = props;

  const [visible, setVisible] = useState(isVisible);

  const onClose = () => {
    setVisible(false);

    if (callbackParent) callbackParent();

  };

  useEffect(() => {
    setVisible(isVisible);
    // 无比注意依赖值的设置，避免死循环
    // eslint-disable-next-line
  }, [isVisible]);

  return (
    <>
      <Drawer
        width={ width || '60%' }
        title={ title }
        placement="right"
        onClose={ onClose }
        visible={ visible }
        footer={ footer }
      >
        { children }
      </Drawer>
    </>
  );
};

export default Home;