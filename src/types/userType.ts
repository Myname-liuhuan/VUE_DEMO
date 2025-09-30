/**
 * 用户信息接口
 */
export interface UserInfo {
  username: string
  userId: string
  authorities?: string[]
  jti?: string
  tokenType?: string
}

/**
 * 用户登录信息接口
 */
export interface LoginUserInfo {
  username: string
  password: string
}

/**
 * 用户角色信息接口
 */
export interface UserRole {
  roles: string[]
}
