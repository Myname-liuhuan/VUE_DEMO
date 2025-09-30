import { ElNotification } from 'element-plus'

/**
 * 解析JWT token的payload
 * @param token JWT token字符串
 * @returns payload对象
 */
export function parseJWTPayload(token: string): any {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Token格式无效')
    }
    return JSON.parse(atob(parts[1]))
  } catch (error) {
    return null
  }
}

/**
 * 验证JWT token格式和有效性
 * @param token JWT token字符串
 * @returns 验证结果
 */
export function validateJWT(token: string): { valid: boolean; message?: string } {
  if (!token) {
    return { valid: false, message: 'Token不存在' }
  }

  try {
    // 简单的JWT token格式验证
    const parts = token.split('.')
    if (parts.length !== 3) {
      return { valid: false, message: 'Token格式无效' }
    }

    // 检查token是否过期（简单的payload解析）
    const payload = parseJWTPayload(token)
    if (!payload) {
      return { valid: false, message: 'Token解析失败' }
    }

    const currentTime = Math.floor(Date.now() / 1000)

    if (payload.exp && payload.exp < currentTime) {
      return { valid: false, message: 'Token已过期' }
    }

    return { valid: true }
  } catch (error) {
    return { valid: false, message: 'Token验证失败' }
  }
}

/**
 * 清除认证信息
 */
export function clearAuthInfo() {
  localStorage.removeItem('token')
  localStorage.removeItem('roles')
}

/**
 * 显示认证错误通知
 */
export function showAuthError(message: string) {
  ElNotification({
    title: '认证失败',
    message,
    type: 'error',
    duration: 3000,
  })
}
