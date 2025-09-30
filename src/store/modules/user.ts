import { defineStore } from 'pinia'
import { login as loginApi } from '@/api/authApi'
import { ElNotification } from 'element-plus'
import { validateJWT, clearAuthInfo, showAuthError, parseJWTPayload } from '@/utils/auth'
import type { UserInfo } from '@/types/userType'

export const useUserStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'userState',
  // state: 返回对象的函数
  state: () => ({
    // 登录token
    token: null as string | null,
    // 登录用户信息
    userInfo: {} as UserInfo,
    // 角色
    roles: localStorage.roles ? JSON.parse(localStorage.roles) : ([] as string[]),
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
            // 将token存储到localStorage
            localStorage.setItem('token', response.data.token)

            // 直接从token解析用户信息，而不是使用响应中的user数据
            try {
              const payload = parseJWTPayload(response.data.token)
              if (payload) {
                this.userInfo = {
                  username: payload.username || payload.sub || userInfo.username,
                  userId: payload.sub || '',
                  ...(payload.authorities && { authorities: payload.authorities }),
                  ...(payload.jti && { jti: payload.jti }),
                  ...(payload.tokenType && { tokenType: payload.tokenType }),
                }
              } else {
                // 如果token解析失败，回退到响应数据或原始输入
                this.userInfo = response.data.user || userInfo
              }
            } catch (error) {
              // 如果token解析失败，回退到响应数据或原始输入
              this.userInfo = response.data.user || userInfo
            }

            await this.getRoles()
            resolve(response.data)
          } else {
            // 如果后端没有返回token，拒绝登录
            reject(new Error('登录失败：未获取到token'))
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
    // 从token中解析用户角色信息
    getRoles() {
      return new Promise((resolve, reject) => {
        const token = this.token || localStorage.getItem('token')
        if (!token) {
          this.roles = []
          localStorage.roles = JSON.stringify(this.roles)
          resolve(this.roles)
          return
        }

        try {
          const payload = parseJWTPayload(token)
          if (payload && payload.roles) {
            // 从token payload中获取角色信息
            this.roles = Array.isArray(payload.roles) ? payload.roles : [payload.roles]
          } else {
            // 如果token中没有角色信息，使用默认值
            this.roles = ['admin']
          }
          localStorage.roles = JSON.stringify(this.roles)
          resolve(this.roles)
        } catch (error) {
          this.roles = ['admin']
          localStorage.roles = JSON.stringify(this.roles)
          resolve(this.roles)
        }
      })
    },
    // 从token中解析用户信息
    getInfo(roles?) {
      return new Promise((resolve, reject) => {
        const token = this.token || localStorage.getItem('token')
        if (!token) {
          reject(new Error('Token不存在'))
          return
        }

        try {
          const payload = parseJWTPayload(token)
          if (payload) {
            // 从token payload中获取用户信息
            this.userInfo = {
              username: payload.username || payload.sub || '',
              userId: payload.sub || '',
              // 可以添加其他需要从token解析的字段
              ...(payload.authorities && { authorities: payload.authorities }),
              ...(payload.jti && { jti: payload.jti }),
              ...(payload.tokenType && { tokenType: payload.tokenType }),
            }

            // 如果传入了roles参数，使用传入的roles，否则从token解析
            if (roles) {
              this.roles = roles
            } else if (payload.roles) {
              this.roles = Array.isArray(payload.roles) ? payload.roles : [payload.roles]
            }

            localStorage.roles = JSON.stringify(this.roles)
            resolve(this.userInfo)
          } else {
            reject(new Error('Token解析失败'))
          }
        } catch (error) {
          reject(new Error('获取用户信息失败'))
        }
      })
    },
    // 验证token是否有效
    validateToken() {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem('token')
        if (!token) {
          reject(new Error('Token不存在'))
          return
        }

        const validation = validateJWT(token)
        if (validation.valid) {
          this.token = token
          resolve(token)
        } else {
          reject(new Error(validation.message || 'Token验证失败'))
        }
      })
    },

    // 退出
    logout() {
      return new Promise((resolve, reject) => {
        this.token = null
        this.userInfo = {}
        this.roles = []
        clearAuthInfo()
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
