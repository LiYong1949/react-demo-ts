import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/app.less';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Routes from './routes/index';
import './routes/global.d';

ReactDOM.render(<ConfigProvider locale={zhCN}><Routes /></ConfigProvider>, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();