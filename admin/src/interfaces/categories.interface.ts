export interface ICreatOneCategory {
  parentIdArr: string[] | null
  name: string
}

export interface IOptions {
  value: string
  label: string
  children?: Array<IOptions> | null
}

export interface ICategoriesTree {
  id?: number
  name?: string
  children?: Array<ICategoriesTree> | null
  createDate: Date
  updateDate: Date
  value?: string
  label?: string
}
