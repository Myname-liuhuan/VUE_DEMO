import { defineStore } from 'pinia'
import { login as loginApi } from '@/api/authApi'
import { myMenuTree } from '@/api/systemApi'
import { validateJWT, clearAuthInfo, parseJWTPayload } from '@/utils/auth'
import type { UserInfo } from '@/types/userType'

export const useUserStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'userStore',
  // state: 返回对象的函数
  state: () => ({
    // 登录token
    token: null as string | null,
    // 登录用户信息
    userInfo: {} as UserInfo,
    // 角色
    roles: localStorage.roles ? JSON.parse(localStorage.roles) : ([] as string[]),
    // 权限路径列表
    permissions: localStorage.permissions ? JSON.parse(localStorage.permissions) : ([] as { path: string; name?: string }[]),
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

            // 直接从token解析用户信息，而不是再去请求user数据
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
            await this.getPermissions()
            resolve(response.data)
          } else {
            // 如果后端没有返回token，拒绝登录
            reject(new Error('登录失败：未获取到token'))
          }
        } catch (error) {
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
    // 从myMenuTree接口获取用户权限信息
    getPermissions() {
      return new Promise(async (resolve, reject) => {
        const token = this.token || localStorage.getItem('token')
        if (!token) {
          this.permissions = []
          localStorage.permissions = JSON.stringify(this.permissions)
          resolve(this.permissions)
          return
        }

        try {
          // 调用myMenuTree接口获取菜单数据
          const response = await myMenuTree()

          if (response && response.data) {
            // 从菜单数据中提取权限信息
            const permissions: { path: string; name?: string; authority: string }[] = []

            // 递归遍历菜单树，提取所有权限
            const extractPermissions = (menuList: any[]) => {
              menuList.forEach((menu) => {
                // 如果菜单项有perms字段，提取权限
                if (menu.perms) {
                  permissions.push({
                    path: menu.path || '/',
                    name: menu.menuName,
                    authority: menu.perms,
                  })
                }

                // 递归处理子菜单
                if (menu.children && menu.children.length > 0) {
                  extractPermissions(menu.children)
                }
              })
            }

            extractPermissions(response.data)
            this.permissions = permissions

            // 如果没有提取到任何权限，管理员拥有所有权限
            if (this.permissions.length === 0 && this.roles.includes('admin')) {
              this.permissions = [{ path: '/', name: '全部权限', authority: '*' }]
            }
          } else {
            // 接口调用失败，使用默认值
            this.permissions = this.roles.includes('admin') ? [{ path: '/', name: '全部权限', authority: '*' }] : []
          }

          localStorage.permissions = JSON.stringify(this.permissions)
          resolve(this.permissions)
        } catch (error) {
          // 如果接口调用失败，管理员拥有所有权限，其他用户无权限
          this.permissions = this.roles.includes('admin') ? [{ path: '/', name: '全部权限', authority: '*' }] : []
          localStorage.permissions = JSON.stringify(this.permissions)
          resolve(this.permissions)
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
        this.permissions = []
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
