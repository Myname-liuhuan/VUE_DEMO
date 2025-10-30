import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/store/modules/user'
import { errorCodeType } from './errorCodeType'
// 创建axios实例 进行基本参数配置
const service = axios.create({
  // 默认请求地址，根据环境的不同可在.env 文件中进行修改
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 设置接口访问超时时间
  timeout: 3000000, // request timeout，
  // 跨域时候允许携带凭证
  withCredentials: true,
})

//  request interceptor 接口请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    /**
     * 用户登录之后获取服务端返回的token,后面每次请求都在请求头中带上token进行JWT校验
     * token 存储在本地储存中（storage）、vuex、pinia
     */
    const userStore = useUserStore()
    const token: string = userStore.token
    // 自定义请求头
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  (error: AxiosError) => {
    // 请求错误，这里可以用全局提示框进行提示
    return Promise.reject(error)
  },
)

//  response interceptor 接口响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    //返回结果为空或者奇怪的格式
    if (!res || typeof res !== 'object') {
      return Promise.reject({
        code: 400,
        message: '请求错误',
      })
    }
    //返回结果不是正确的（200）
    if (res.code !== 200) {
      return Promise.reject(res)
    }
    //正确的结果
    return res
  },
  (error: AxiosError) => {
    // 判断HTTP状态码，如果不是200就返回errorCodeType中的错误
    let errorMessage = '请求失败'
    if (error.response && error.response.status) {
      errorMessage = errorCodeType(error.response.status)
    }
    return Promise.reject({
      code: error.response.status,
      message: errorMessage,
    })
  },
)

// /**
//  * @description 显示错误消息
//  * opt 传入参数
//  * err 错误信息
//  * type 消息类型
//  * duration 消息持续时间
//  */
// function showErrMessage(opt, err, type: any = 'error', duration = 5000) {
//   ElMessage({
//     message: err.msg,
//     type: type,
//     duration: duration,
//   });
// }

export default service
