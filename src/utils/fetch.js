import axios from 'axios';
import {
  Message, MessageBox
} from 'element-ui';
import store from '../store';
import {
  getToken
} from 'utils/auth';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 50000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
     // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    //config.headers['Authorization'] = getToken();
    config.headers['token'] = getToken();
  }
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
  response => {
    //const status = response.status;
    const data = response.data;
    const code = data.code;
    const mesg = data.mesg;

    if (code === '31101') {
      MessageBox.confirm('请重新登录！', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogout').then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      })
      return Promise.reject('error');
    }
    if (code === '31301') {
      Message({
        message: '没有权限！',
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject('error');
    }
    if (code === 'S80002') {
        Message({
            message: mesg,
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject('error');
    }
    // 正常码(310**)、非正常的时候提示错误
    if (code !== "S0000" && !code.startsWith("310") && !code.startsWith("S")) {
      Message({
        message: mesg,
        type: 'error',
        duration: 5 * 1000
      });

      return Promise.reject('error');
      //return data;
    } else {
      return data;
    }
  },
  error => {
    console.log('err' + error); // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
