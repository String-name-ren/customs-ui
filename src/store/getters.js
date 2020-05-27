const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.app.visitedViews,
  token: state => state.user.token,
  type: state => state.user.type,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  about: state => state.user.about,
  status: state => state.user.status,
  roles: state => state.user.roles,
  userMenus: state => state.user.userMenus,
  userElements: state => state.user.userElements,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  permissionMenus: state => state.user.permissionMenus
};
export default getters
