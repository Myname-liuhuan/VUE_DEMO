import path from 'path-browserify'
/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles 用户角色数组
 * @param permissions 用户权限路径数组
 */
export function filterAsyncRoutes(routes, roles, permissions = []) {
  const res = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles, permissions)
      }
      res.push(tmp)
    }
  })
  return res
}

/**
 * 使用 meta.role 和 authorities 权限来确定当前用户是否具有权限
 * -如果路由没有设置 meta.role，则表示所有角色均可访问
 * -如果路由没有设置权限要求，则表示所有用户均可访问
 * @param roles 用户角色数组
 * @param permissions 用户权限数组（基于authorities）
 * @param route 路由对象
 */
export function hasPermission(roles, permissions, route) {
  // 检查角色权限
  const hasRolePermission = !route.meta?.roles || route.meta.roles.some((role) => roles.includes(role))

  // 检查 authorities 权限 - 新的权限验证逻辑
  const hasAuthorityPermission =
    !permissions ||
    permissions.length === 0 ||
    permissions.some((permission) => {
      // 支持基于路径的权限验证
      if (permission.path) {
        return route.path === permission.path || route.path.startsWith(permission.path + '/') || permission.path === route.path
      }
      // 支持基于权限标识符的验证（如：sys:user:query）
      if (permission.authority) {
        // 检查路由是否需要特定的权限
        if (route.meta?.authority) {
          return permission.authority === route.meta.authority
        }
        // 根据路由路径推断需要的权限
        const routePath = route.path
        const authority = permission.authority
        // 例如：authority = "sys:user:query" 应该匹配路径 "/system/user"
        const authorityParts = authority.split(':')
        if (authorityParts.length >= 2) {
          const module = authorityParts[0] // sys
          const resource = authorityParts[1] // user
          // 检查路由路径是否匹配权限模块
          return routePath.includes(`/${module}`) || routePath.includes(`/${resource}`)
        }
      }
      return false
    })

  // 如果路由没有定义任何权限要求，则允许访问
  if (!route.meta?.roles && (!permissions || permissions.length === 0)) {
    return true
  }

  // 需要同时满足角色和权限验证
  return hasRolePermission && hasAuthorityPermission
}

/**
 * @description 使用递归，过滤需要缓存的路由
 * @param {Array} _route 所有路由表
 * @param {Array} _cache 缓存的路由表
 * @return void
 * */

export function filterKeepAlive(routers) {
  const cacheRouter: any[] = []
  const deep = (routers) => {
    routers.forEach((item) => {
      if (item.meta?.keepAlive && item.name) {
        cacheRouter.push(item.name)
      }
      if (item.children && item.children.length) {
        deep(item.children)
      }
    })
  }
  deep(routers)
  return cacheRouter
}

export function handleRoutes(routers, pathUrl = '') {
  routers.forEach((item) => {
    item.path = path.resolve(pathUrl, item.path)
  })
}
