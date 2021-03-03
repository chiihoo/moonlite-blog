<template>
  <div>
    <el-row class="top-bar" type="flex" align="bottom">
      <el-col :span="0"><h1>文章</h1></el-col>
      <el-col :span="0" :offset="2">
        <router-link to="/articles/create">
          <el-button size="medium" type="primary">创建文章</el-button>
        </router-link>
      </el-col>
      <el-col :span="0" :offset="2">
        <el-cascader
          size="medium"
          v-model="cascaderSelectedArr"
          @change="handleChangeCurrentCategory"
          :options="options"
          :props="{ checkStrictly: true, expandTrigger: 'hover' }"
          collapse-tags
          :show-all-levels="false"
          placeholder="文章分类"
          clearable
        >
        </el-cascader>
      </el-col>
    </el-row>
  </div>
  <el-table :data="articlesData" style="width: 100%" v-loading="loading">
    <el-table-column prop="id" label="id" width="180"></el-table-column>
    <el-table-column prop="title" label="标题" width="180"></el-table-column>
    <el-table-column prop="coverUrl" label="封面" v-slot="scope">
      <el-image
        v-if="scope.row.coverUrl"
        style="width: 100px; height: 100px"
        :src="scope.row.coverUrl"
        fit="scale-down"
      ></el-image>
    </el-table-column>
    <el-table-column prop="categoryName" label="分类" width="180"></el-table-column>
    <el-table-column prop="createDate" label="创建时间" sortable></el-table-column>
    <el-table-column prop="updateDate" label="更新时间" sortable></el-table-column>
    <el-table-column label="操作" fixed="right" width="100">
      <template #default="scope">
        <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    background
    layout="total, sizes, prev, pager, next"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[5, 10, 25, 50]"
    :page-size="limit"
  >
  </el-pagination>
</template>

<script lang="ts">
import { fetchArticlesDelete, fetchArticlesList, fetchCategoriesTree } from '@/api'
import { IArticlesData, IOptions, IFetchArticlesData } from '@/interfaces'
import { formatCategoriesTree } from '@/utils/tools'
import { defineComponent, onMounted, reactive, ref, shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import moment from 'moment'

export default defineComponent({
  name: 'Articles',
  setup() {
    const router = useRouter()

    const value = ref<string>('分类')

    const cascaderSelectedArr = ref<string[] | null>()

    const options = shallowRef<IOptions[]>([])

    const articlesData = reactive<IArticlesData[]>([])

    const loading = ref<boolean>(false)

    const total = ref<number>(0)
    const currentPage = ref<number>(1)
    const limit = ref<number>(5)
    const offset = ref<number>(0)

    const loadCategoriesTree = async () => {
      const treeRes = await fetchCategoriesTree()
      // 将获取到的树状结构，递归，将id:number复制为value:string，name复制成label
      formatCategoriesTree(treeRes)
      options.value = treeRes
    }

    const loadArticlesList = async () => {
      loading.value = true
      const res: IFetchArticlesData = await fetchArticlesList({
        limit: limit.value,
        offset: offset.value,
        categoryId: cascaderSelectedArr.value?.[cascaderSelectedArr.value.length - 1]
      })
      total.value = res.total

      articlesData.length = 0

      for (let item of res.articlesList) {
        articlesData.push({
          ...item,
          categoryName: item.category?.name,
          createDate: moment(item.createDate).utc().format('YYYY-MM-DD HH:mm:ss'),
          updateDate: moment(item.updateDate).utc().format('YYYY-MM-DD HH:mm:ss')
        })
      }
      loading.value = false
    }

    onMounted(async () => {
      Promise.all(
        [loadCategoriesTree(), loadArticlesList()].map(p =>
          p.catch(e => {
            console.log(e)
          })
        )
      )
    })

    const handleChangeCurrentCategory = async (value: string[] | null) => {
      await loadArticlesList()
    }

    const edit = (row: IArticlesData) => {
      router.push(`/articles/edit/${row.id}`)
    }

    const remove = (row: IArticlesData) => {
      ElMessageBox.confirm('此操作将删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await fetchArticlesDelete(row.id)
          ElMessage({
            type: 'success',
            center: true,
            showClose: true,
            duration: 1000,
            message: '删除成功!'
          })
          await loadArticlesList()
        })
        .catch(() => {})
    }

    const handleCurrentChange = (currentPage: number) => {
      offset.value = currentPage - 1
      loadArticlesList()
    }
    const handleSizeChange = (val: number) => {
      // 每页的条数
      limit.value = val
      loadArticlesList()
    }

    return {
      value,
      options,
      cascaderSelectedArr,
      articlesData,
      edit,
      remove,
      handleChangeCurrentCategory,
      total,
      loading,
      currentPage,
      handleCurrentChange,
      handleSizeChange,
      limit
    }
  }
})
</script>

<style scoped lang="scss">
.top-bar {
  margin: 10px 0 20px;
  h1 {
    font-size: 30px;
    margin: 0;
  }
}
.el-pagination {
  margin-top: 20px;
}
</style>
