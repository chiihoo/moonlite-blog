import { ICreateOneArticle, IEditOneArticle, IGetArticles } from '@/interfaces'
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
  return axios.post(`/categories`, {
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
  return axios.put(`/categories`, {
    id,
    name,
    parent_id
  })
}

// 删除分类
export const fetchCategoriesDelete = (id: string): Promise<any> => {
  return axios.delete(`/categories?id=${id}`)
}

// 根据id获取单个分类信息
export const fetchCategoryById = (id: string): Promise<any> => {
  return axios.get(`/categories/?id=${id}`)
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
  return axios.get('/categories/isNameVaild', {
    params: {
      name,
      parent_id
    }
  })
}

// 创建文章
export const fetchArticlesCreate = (data: ICreateOneArticle): Promise<any> => {
  return axios.post('/articles', data)
}

// 修改文章
export const fetchArticlesEdit = (data: IEditOneArticle): Promise<any> => {
  return axios.put('/articles', data)
}

// 删除文章
export const fetchArticlesDelete = (id: string): Promise<any> => {
  return axios.delete(`/articles?id=${id}`)
}

// 通过
export const fetchArticlesByCategoryId = (categoryId: string): Promise<any> => {
  return axios.get(`/articles?categoryId=${categoryId}`)
}

// 查找文章 可以通过分类id查找文章
// limit每页最多返回多少数据
// offset偏移量，分页，0为第一页
export const fetchArticlesList = (data?: IGetArticles): Promise<any> => {
  return axios.get('/articles', { params: data })
}

// 根据获取文章信息
export const fetchArticleById = (id: string): Promise<any> => {
  return axios.get('/articles/one', { params: { id } })
}
