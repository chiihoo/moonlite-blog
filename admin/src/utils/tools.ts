import { ICategoriesTree } from '../interfaces'

// 将获取到的树状结构，递归，将id复制为value，name复制成label
export function formatCategoriesTree(list: Array<ICategoriesTree>) {
  const helper = (obj: Array<ICategoriesTree> | ICategoriesTree) => {
    if (obj instanceof Array) {
      obj.forEach(item => helper(item))
    } else if (obj instanceof Object) {
      Object.keys(obj).forEach(key => {
        if (key === 'id') {
          obj['value'] = '' + obj[key]
        } else if (key === 'name') {
          obj['label'] = obj[key]
        } else if (key === 'children') {
          if (obj[key]?.length === 0) {
            obj[key] = null
          } else {
            helper(obj[key] as Array<ICategoriesTree>)
          }
        }
      })
    }
  }
  helper(list)
}

// Cascader组件的值是一个包含树路径的数组，需要从目标结点的id来查找到从根结点到目标结点的路径，在Cascader里面体现为value
// 回溯
export function findRouteFromTreeByValue(
  list: Array<ICategoriesTree>,
  value: string,
  temp: string[] = []
): string[] | null {
  for (let node of list) {
    temp.push(node.value as string)
    if (node.value === value) {
      return temp
    }
    if (node.children && node.children.length > 0) {
      let result = findRouteFromTreeByValue(node.children, value, temp)
      if (result !== null) return result
    }
    temp.pop()
  }
  return null
}

// export function findRouteFromTreeByValue(list: Array<ICategoriesTree>, value: string) {
//   const res: string[] = []
//   const temp: string[] = []
//   function helper(list: Array<ICategoriesTree>) {
//     for (let node of list) {
//       temp.push(node.value as string)
//       if (node.value === value) {
//         res.push(...temp)
//         return
//       }
//       if (node.children && node.children.length > 0) {
//         helper(node.children)
//       }
//       temp.pop()
//     }
//   }
//   helper(list)
//   return res.length > 0 ? res : null
// }
