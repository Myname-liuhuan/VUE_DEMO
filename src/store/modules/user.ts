import { defineStore } from 'pinia'
import { login as loginApi } from '@/api/authApi'
import { ElNotification } from 'element-plus'

export const useUserStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'userState',
  // state: 返回对象的函数
  state: () => ({
    // 登录token
    token: null,
    // 登录用户信息
    userInfo: {},
    // 角色
    roles: localStorage.roles ? JSON.parse(localStorage.roles) : [],
  }),
  getters: {},
  // 可以同步 也可以异步
  actions: {
    // 登录
    login(userInfo) {
      const { username, password } = userInfo
      return new Promise(async (resolve, reject) => {
        try {
          // 调用后台接口进行登录验证
          const response = await loginApi({
            username,
            password,
          })

          // 假设后端返回的数据结构包含token
          if (response.data && response.data.token) {
            this.token = response.data.token
            this.userInfo = response.data.user || userInfo
            await this.getRoles()
            resolve(response.data)
          } else {
            // 如果后端没有返回token，使用用户名作为token（兼容模式）
            this.token = username
            this.userInfo = userInfo
            await this.getRoles()
            resolve(username)
          }
        } catch (error) {
          ElNotification({
            title: '登录失败',
            message: error.response?.data?.message || '用户名或密码错误',
            type: 'error',
            duration: 3000,
          })
          reject(error)
        }
      })
    },
    // 获取用户授权角色信息，实际应用中 可以通过token通过请求接口在这里获取用户信息
    getRoles() {
      return new Promise((resolve, reject) => {
        // 获取权限列表 默认就是超级管理员，因为没有进行接口请求 写死
        this.roles = ['admin']
        localStorage.roles = JSON.stringify(this.roles)
        resolve(this.roles)
      })
    },
    // 获取用户信息 ，如实际应用中 可以通过token通过请求接口在这里获取用户信息
    getInfo(roles) {
      return new Promise((resolve, reject) => {
        this.roles = roles
        resolve(roles)
      })
    },
    // 退出
    logout() {
      return new Promise((resolve, reject) => {
        this.token = null
        this.userInfo = {}
        this.roles = []
        resolve(null)
      })
    },
  },
  // 进行持久化存储
  persist: {
    // 本地存储的名称
    key: 'userState',
    //保存的位置
    storage: window.localStorage, //localstorage
  },
})
