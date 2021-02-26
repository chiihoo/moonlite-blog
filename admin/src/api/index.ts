import axios from '../utils/axios'

// 登录
export const fetchLogin = (username: string, password: string): Promise<any> => {
  return axios.post(`/auth/login`, {
    username,
    password
  })
}

// 创建分类
export const fetchCategoriesCreate = (name: string, parent_id: string | null): Promise<any> => {
  return axios.post(`/categories/create`, {
    name,
    parent_id
  })
}

// 修改分类
export const fetchCategoriesEdit = (
  id: string,
  name: string,
  parent_id: string | null
): Promise<any> => {
  return axios.post(`/categories/edit`, {
    id,
    name,
    parent_id
  })
}

// 删除分类
export const fetchCategoriesDelete = (id: string): Promise<any> => {
  return axios.delete(`/categories/delete?id=${id}`)
}

// 根据id获取单个分类信息
export const fetchCategoryById = (id: string): Promise<any> => {
  return axios.get(`/categories/one/?id=${id}`)
}

// 获取分类树
export const fetchCategoriesTree = (): Promise<any> => {
  return axios.get(`/categories/tree`)
}

// 检测分类名称是否可用，判断标准为同一级是否有相同名称
export const fetchCategoriesIsNameVaild = (
  name: string,
  parent_id: string | null
): Promise<any> => {
  // get请求传递null，后端拿到是字符串"null"
  return axios.get(
    `categories/isNameVaild?name=${name}` + (parent_id ? `&parent_id=${parent_id}` : '')
  )
}
