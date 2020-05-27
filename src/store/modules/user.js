import {
  login,
  logout,
  getInfos,
  getMenuTree,
  codeMaker,
  codeImgLogin
} from 'api/auth';
import {
  getToken,
  setToken,
  removeToken
} from 'utils/auth';
import {
  buildTree
} from 'utils/tree';
import {
  Message
} from 'element-ui';

import avatar from 'assets/avatar.jpeg'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    type: undefined,
    avatar: '',
    about: '',
    roles: [],
    userMenus: undefined,
    userElements: undefined,
    permissionMenus: undefined,
    setting: {
      platform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_ABOUT: (state, about) => {
      state.about = about;
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_MENUS: (state, userMenus) => {
      state.userMenus = userMenus;
    },
    SET_ELEMENT: (state, userElements) => {
      state.userElements = userElements;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success');
    },
    LOGOUT_USER: state => {
      state.user = '';
    },
    SET_PERMISSION_MENUS: (state, permissionMenus) => {
      state.permissionMenus = permissionMenus;
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim();

      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      commit('SET_MENUS', undefined);
      commit('SET_ELEMENT', undefined);
      removeToken();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const code = response.code;
          const mesg = response.msg;
          const data = response.data;

          if (data.token === '') {
            Message({
              message: '账户或密码错误！',
              type: 'warning'
            });
            return Promise.reject('error');
          } else {
            setToken(data.token);
            commit('SET_TOKEN', data.token);
            resolve();
          }
        }).catch(error => {
          reject(error);
        });
      });
    },
    //验证码获取
    CodeMaker({
      commit
    }) {
      return new Promise((resolve, reject) => {
        codeMaker().then(response => {
          const code = response.code;
          const mesg = response.msg;
          const data = response.data;

          if (data.token === '') {
            Message({
              message: '验证生成异常！',
              type: 'warning'
            });
            return Promise.reject('error');
          } else {
            commit('SET_TOKEN', data.token);
            resolve(data);
          }
        }).catch(error => {
          reject(error);
        });
      });
    },

    //验证码登录
    CodeImgLogin({
      commit,
      state
    }, userInfo) {
      const username = userInfo.username.trim();

      commit('SET_ROLES', []);
      commit('SET_MENUS', undefined);
      commit('SET_ELEMENT', undefined);
      return new Promise((resolve, reject) => {
        codeImgLogin(username, userInfo.password, userInfo.codeImg, state.token).then(response => {
          const code = response.code;
          const mesg = response.msg;
          const data = response.data;

          console.info("code:" + code);

          if(code==='S0021'){
              Message({
                  message: '账户信息或验证码错误！',
                  type: 'warning'
              });
              return Promise.reject('error');
          }

          if (data.token === '') {
            Message({
              message: '账户信息或验证码错误！',
              type: 'warning'
            });
            return Promise.reject('error');
          } else {
            setToken(data.token);
            commit('SET_TOKEN', data.token);
            resolve();
          }
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    GetInfos({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfos(state.token).then(response => {
          let data = response.data;
          sessionStorage.userId = data.user.id;
          state.type = data.user.type;
          commit('SET_ROLES', data.user.roles);
          commit('SET_NAME', data.user.name);
          commit('SET_AVATAR', data.user.icon ? data.user.icon : avatar);
          commit('SET_ABOUT', data.user.description);
          const userMenus = {};
          for (let i = 0; i < data.menus.length; i++) {
            userMenus[data.menus[i].code] = true;
          }
          commit('SET_MENUS', userMenus);
          let userMenuTree = buildTree(data.menus);
          commit('SET_PERMISSION_MENUS', userMenuTree);

          const userElements = {};
          for (let i = 0; i < data.elements.length; i++) {
            data.elements[i].display = true;
            userElements[data.elements[i].code] = data.elements[i];
          }
          commit('SET_ELEMENT', userElements);

          resolve(data);
        }).catch(error => {
          reject(error);
        });
        /*
        getMenuTree(state.token).then(response => {
          const code = response.code;
          const mesg = response.msg;
          const data = response.data;

          commit('SET_PERMISSION_MENUS', data);
        });
        */
      });
    },

    // 登出
    Logout({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(response => {
          const code = response.code;
          const mesg = response.msg;
          const data = response.data;

          if(data){
            state.userId = undefined;
            commit('SET_TOKEN', '');
            commit('SET_ROLES', []);
            commit('SET_MENUS', undefined);
            commit('SET_ELEMENT', undefined);
            commit('SET_PERMISSION_MENUS', undefined);
            removeToken();
            resolve();
          } else {
            reject(mesg);
          }
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端登出
    FedLogout({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_MENUS', undefined);
        commit('SET_ELEMENT', undefined);
        commit('SET_PERMISSION_MENUS', undefined);
        removeToken();
        resolve();
      });
    },

    // 动态修改权限
    ChangeRole({
      commit
    }, role) {
      return new Promise(resolve => {
        commit('SET_ROLES', [role]);
        commit('SET_TOKEN', role);
        setToken(role);
        resolve();
      })
    }
  }
};

export default user;
