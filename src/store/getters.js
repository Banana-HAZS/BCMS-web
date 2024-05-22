const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  picture: state => state.user.picture,
  name: state => state.user.name,
  isLoggedIn: state => state.isLoggedIn,
  menuList: state => state.user.menuList,
  
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routes: state => state.permission.routes
}
export default getters
