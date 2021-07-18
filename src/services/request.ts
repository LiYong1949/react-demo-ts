import axios, { AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import {
  remove,
  findLast
} from 'lodash';
const baseWaitTime = 100; // 默认的等待时间100毫秒

const requestURLRate: Array<Object> = []; // 如：{ api: '/api/standardRoles', timestamp: 1596597701181 }

declare var global: any;

export type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK'

/**
 * 请求出入口
 * @param {*} api 地址
 * @param {*} method 方法，默认为GET
 * @param {*} params 参数，默认为空对象
 * @param {*} maxRequestCycleCount 最大请求频次（与baseWaitTime结合），默认为1
 * @param {*} serverHost 接口主机地址
 * @param {*} headers 传入头部信息，默认为空对象
 */
export default function axiosRequest(api: string, method: Method = 'GET', params:any = {}, maxRequestCycleCount: number = 1, serverHost?: string, headers:any = {}) {

  // 针对非GET请求进行限流拦截
  if (method !== 'GET') {

    let nowTimestamp = new Date().getTime(); // 当前时间戳

    // 去除当前接口指定周期外的数据
    remove(requestURLRate, (o: any) => {
      return o.api === api && o.timestamp < nowTimestamp - (maxRequestCycleCount * baseWaitTime);
    });

    // 获取上一次请求信息（一般同周期只有一个，防止处理意外）
    let hasRequestURLRate = findLast(requestURLRate, (o: any) => (o.api === api));

    if (hasRequestURLRate) {

      message.warning('当前访问的频次过高，请适当放慢手速！', 1);

      // 为了保持数据完整性，返回数据与接口定义一致
      return {
        errcode: -100,
        msg: null
      };

    } else {
      requestURLRate.push({
        api,
        timestamp: new Date().getTime()
      });
    }

  }

  return new Promise((resolve: any, reject: any) => {

    let token = global.G_LOCALSTORAGE_GET('_TOKEN');

    let sendData: AxiosRequestConfig = {
      method,
      headers: {
        ...headers,
        authorization: 'Bearer ' + token,
      },
      url: (serverHost || global.G_SERVER_HOST) + api,
      data: params
    };

    axios(sendData)
    .then((res) => {

      let { errcode, msg } = res.data;

      if (errcode && errcode < 0) {
        message.error(msg || '请求错误！', 1);
        // 直接跳转到登录页面（简单粗暴）
        if (errcode === -401) {
          if (global._PROPS) {
            global._PROPS.history.push('/login');
          } else {
            window.location.href = '/login';
          }
        }
      }

      resolve(res.data);

    })
    .catch((error: any) => {

      if (error) {
        message.error(`服务端发生逻辑错误！${JSON.stringify(error)}`, 1);
      }

      reject(error);

    })
  })
}