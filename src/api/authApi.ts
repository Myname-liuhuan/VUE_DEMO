import request from './common/request'

export function login(data) {
  return request({
    url: '/vue-element-perfect/user/login',
    method: 'post',
    data,
  })
}

export function loginLocal(data: { username: string; password: string }) {
  return request({
    url: 'http://127.0.0.1:9080/api/auth/login',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
