import fetch from 'utils/fetch';

const prefixPath = '/system/auth/';

export function codeMaker() {
  return fetch({
    url: prefixPath + 'codeMaker',
    method: 'get',
    params: {}
  });
}

export function codeImgLogin(username, password, codeImg, token) {
  return fetch({
    url: prefixPath + 'codeImgLogin',
    method: 'post',
    data: {
      username,
      password,
      codeImg,
      token
    }
  });
}

export function login(username, password) {
  return fetch({
    url: prefixPath + 'login',
    method: 'post',
    data: {
      username,
      password
    }
  });
}

export function logout(token) {
  return fetch({
    url: prefixPath + 'logout',
    method: 'post',
    params: { token }
  });
}

export function getInfos(token) {
  return fetch({
    url: prefixPath + 'infos',
    method: 'get',
    params: { token }
  });
}

export function getMenuList(token) {
  return fetch({
    url: prefixPath + 'menuList',
    method: 'get',
    params: { token }
  });
}

export function getMenuTree(token) {
  return fetch({
    url: prefixPath + 'menuTree',
    method: 'get',
    params: { token }
  });
}

export function updatePassWord(passWord,newPassWord) {
  return fetch({
    url: prefixPath + 'updatePassWord',
    method: 'put',
    data: {
      passWord,
      newPassWord
    }
  })
}
