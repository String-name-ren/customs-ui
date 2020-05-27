import {
  asyncRouterMap,
  constRouterMap
} from 'src/router'

import { getMenuList as GetMenuList } from 'api/auth/index';

/**
 * 判断路由是否与当前用户权限匹配
 * @param menus 用户可以访问的菜单
 * @param route 当前配置的菜单路由
 */
function hasPermission(menus, route) {
  if(route.hidden) {
    return true;
  }
  if (route.code) {
    if (menus[route.code] !== undefined) {
      return menus[route.code];
    } else {
      return false;
    }
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param curRouter 当前配置的菜单路由
 * @param authMenus 用户可以访问的菜单
 * @param menuDatas 当前存储的菜单数据
 */
function filterAsyncRouter(curRouter, authMenus, menuDatas) {
  const accessedRouters = curRouter.filter(route => {
    // 判断路由是否与当前用户权限匹配
    if (hasPermission(authMenus, route)) {
      if(menuDatas[route.code]){
        // 更新路由信息
        route.name = menuDatas[route.code].name;
        route.icon = menuDatas[route.code].icon;
      }

      // 递归过滤路由
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, authMenus, menuDatas);
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({
      commit
    }, authMenus) {
      return new Promise(resolve => {
          // commit('SET_ROUTERS', constRouterMap.concat(asyncRouterMap));
          // resolve();
        // 取得所有菜单
        GetMenuList().then(response => {
          const code = response.code;
          const mesg = response.msg;
          const data = response.data;

          // 所有菜单数据
          const menuDatas = {};
          for (let i = 0; i < data.length; i++) {
            menuDatas[data[i].code] = data[i];
          }

          // 根据菜单数据整理路由
          const accessedRouters = filterAsyncRouter(asyncRouterMap, authMenus, menuDatas);
          //console.log(accessedRouters);
          commit('SET_ROUTERS', accessedRouters);
          resolve();
        });
      })
    }
  }
};

export default permission;
