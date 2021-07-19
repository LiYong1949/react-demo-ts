import React, { useEffect } from 'react';

const Home = (props: any) => {

  useEffect(() => {

    props.history.push('/console');
  
    // eslint-disable-next-line
  }, []);

 return (
    <div style={{textAlign: 'center', color: 'gray'}}>Loding...</div>
  );
};

export default Home;
