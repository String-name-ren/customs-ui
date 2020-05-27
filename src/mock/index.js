import Mock from 'mockjs';
import loginAPI from './login';

// 测试用数据MOCK
// 登录相关
//Mock.mock(/\/auth\/login/, 'post', loginAPI.login);
//Mock.mock(/\/auth\/logout/, 'post', loginAPI.logout);
//Mock.mock(/\/auth\/infos\.*/, 'get', loginAPI.getInfos)

export default Mock;
