import router from '@/router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3005'
      : 'http://121.196.155.101:5000/api'
})

axiosInstance.interceptors.request.use(
  config => {
    if (localStorage.access_token) {
      config.headers.Authorization = 'Bearer ' + localStorage.getItem('access_token')
    }
    return config
  },
  err => {
    console.log('error', err)
    return Promise.reject(err)
  }
)

axiosInstance.interceptors.response.use(
  res => {
    return res.data
  },
  err => {
    // 'Unauthorized'登录失效或者未登录
    if (err.response?.status === 401) {
      router.push('/login')
    }
    err.response?.data?.error &&
      ElMessage({
        type: 'error',
        center: true,
        showClose: true,
        duration: 1000,
        message: err.response.data.error
      })
    return Promise.reject(err)
  }
)

export default axiosInstance
