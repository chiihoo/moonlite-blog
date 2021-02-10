import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3005'
})

axiosInstance.interceptors.request.use(
  config => {
    if (localStorage.access_token) {
      config.headers.Authorization = 'Bearer' + localStorage.getItem('access_token')
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

axiosInstance.interceptors.response.use(
  res => {
    return res.data
  },
  err => {
    return Promise.reject(err)
  }
)

export default axiosInstance
