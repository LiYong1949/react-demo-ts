import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import api from '../../services/api';
import './common.less';

declare let global: any;

const Home = (props: any) => {

  // 状态控制
  const [loading, setLoading] = useState(false);
  const [fouceType, setFouceType]: any = useState();

  // 登录处理
  const handleLogin = async (values: any) => {

    setLoading(true);

    let { errcode, data }: any = await api.login(values);

    setLoading(false);

    // 登录成功并跳转
    if (errcode >= 0) {

      message.success('欢迎回来，登录成功！', 1);

      let { token, user } = data; // user包含了基本数据外，另外含有Applications、Auths

      global.G_LOCALSTORAGE_SET('_TOKEN', token);
      global.G_LOCALSTORAGE_SET('_USERINFO', user);

      props.history.push('/package');

    }

  };

  const handleFouce = (type: string) => {
    setFouceType(type);
  }

  const handleForgotTip = () => {
    message.warning('密码都忘记了我也没办法咯！', 1);
  }

 return (
    <div className="d-login">
      <div className="d-login-container">
        <div className="d-login-left">
          <img className="d-login-bg-1" src="https://docs.cq-tct.com/funenc/metrics.svg" alt=""/>
          <img className="d-login-bg-2" src="https://docs.cq-tct.com/funenc/mobile_login.svg" alt=""/>
          <img className="d-login-bg-3" src="https://docs.cq-tct.com/funenc/two_factor_authentication.svg" alt=""/>
        </div>
        <div className="d-login-right-bg"></div>
        <div className="d-login-right">
          <div className="d-login-title">欢迎登录</div>
          <div className="d-login-sub-title">Fuenc React Template</div>
          <div className="d-login-form">
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={handleLogin}
            >
              <div className="d-login-form-item" style={{borderColor: fouceType === 'username' ? '#C4C0D9' : '#F3F3F3'}}>
                <span>输入账号</span>
                <Form.Item
                  name="userName"
                  rules={[{ required: true, message: '请输入合法的登录账户！' }]}
                >
                  <Input placeholder="请输入登录用户名" size="large" onFocus={() => handleFouce('username')} />
                </Form.Item>
              </div>
              <div className="d-login-form-item" style={{borderColor: fouceType === 'password' ? '#C4C0D9' : '#F3F3F3'}}>
                <span>输入密码</span>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入合法的登录密码！' }]}
                >
                  <Input
                    type="password"
                    placeholder="请输入登录密码"
                    size="large"
                    onFocus={() => handleFouce('password')}
                  />
                </Form.Item>
              </div>
              <Form.Item style={{marginTop:15}}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>

                <a className="login-form-forgot" onClick={handleForgotTip} href="#!">
                  忘记密码？
                </a>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" loading={loading}>立即登录</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
