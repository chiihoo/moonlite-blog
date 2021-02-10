import axios from '../utils/axios'

export interface IHttpData<T = any> {
  data?: T
  error?: {
    code: number
    message: string
  }
}

export const fetchLogin = (username: string, password: string): Promise<IHttpData> => {
  return axios.post(`/auth/login?username=${username}&password=${password}`)
}
