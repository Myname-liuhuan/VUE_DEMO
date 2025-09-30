import request from './common/request'

// 用户登录
export function login(data: { username: string; password: string }) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
