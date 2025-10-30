import request from './common/request'

// 获取用户菜单树
export function myMenuTree() {
  return request({
    url: '/system/sysMenu/myMenuTree',
    method: 'get',
  })
}
