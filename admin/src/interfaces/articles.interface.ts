export interface IFormDataArticle {
  title: string
  categories?: string[] | null
  coverUrl?: string
  content: string
}

export interface ICreateOneArticle {
  title: string
  categoryId?: string
  coverUrl?: string
  content: string
}

export type IEditOneArticle = ICreateOneArticle & { id?: string }
// export interface IEditOneArticle extends ICreateOneArticle {
//   id: string
// }

export interface IGetArticles {
  // 每页最多返回多少数据
  limit?: number
  // 偏移量，分页，0为第一页
  offset?: number
  // 分类Id
  categoryId?: string
}

export interface IArticlesData {
  id: string
  title: string
  categoryName: string
  coverUrl: string
  createDate: string
  updateDate: string
}

export interface IArticle {
  id: string
  title: string
  category: { id: string; name: string }
  coverUrl: string
  createDate: string
  updateDate: string
}

export interface IFetchArticlesData {
  articlesList: IArticle[]
  total: number
}
