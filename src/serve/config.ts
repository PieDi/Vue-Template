import axios, { type AxiosInstance } from 'axios'
const baseURL = import.meta.env.VITE_BASE_URL || ''
console.log('baseURL', baseURL)
const instance: AxiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})
instance.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response
  },
  error => {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export const postRequest = (url: string, data?: any, config?: any) => {
  return instance.post(url, data || {}, config)
}
export const getRequest = (url: string, params: any) => {
  return instance.get(url, {
    params
  })
}
export const putRequest = (url: string, data?: any, config?: any) => {
  return instance.put(url, data||{}, config)
}

export const deleteRequest = (url: string, params: any) => {
  return instance.delete(url, {...params})
}