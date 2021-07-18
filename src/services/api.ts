import axios from './request';

const login = async (datas: object) => { // 登录
    return axios(`/auth/login`, 'POST', datas);
  };