import { param2Obj } from 'utils';

import thumbnail from '../assets/thumbnail.gif';

const userMap = {
  admin: {
    role: ['admin'],
    name: 'Super Admin',
    token: 'admin',
    discription: '系统管理',
    avatar: '../assets/thumbnail.gif',
  },
  client: {
    role: ['client'],
    name: 'Client Manager',
    token: 'client',
    discription: '客户管理',
    avatar: '../assets/thumbnail.gif',
  },
  editor: {
    role: ['editor'],
    name: 'App Editor',
    token: 'editor',
    discription: '应用编辑',
    avatar: '../assets/thumbnail.gif',
  },
  developer: {
    role: ['develop'],
    name: 'App Developer',
    token: 'develop',
    discription: '应用开发',
    avatar: '../assets/thumbnail.gif',
  }
}

export default {
  data() {
    return {
      thumbnail: thumbnail + '?' + new Date(),
    }
  },
  login: config => {
    const { email } = JSON.parse(config.body);
    return userMap[email.split('@')[0]];
  },
  getInfos: config => {
    const { token } = param2Obj(config.url);
    if (userMap[token]) {
      return userMap[token];
    } else {
      return Promise.reject('a');
    }
  },
  logout: () => 'success'
};
