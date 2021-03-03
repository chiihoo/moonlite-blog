<template>
  <el-row class="top-bar" type="flex" align="bottom">
    <el-col :span="0"><h1>分类</h1></el-col>
    <el-col :span="0" :offset="2">
      <router-link to="/categories/create">
        <el-button size="medium" type="primary">创建分类</el-button>
      </router-link>
    </el-col>
  </el-row>
  <el-card class="box-card">
    <el-tree v-loading="loading" :data="data" node-key="id" default-expand-all>
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <span>{{ node.label }}</span>
          <div class="options">
            <a @click="append(data)">添加</a>
            <a @click="edit(data)">修改</a>
            <a @click="remove(node, data)">删除</a>
          </div>
        </div>
      </template>
    </el-tree>
  </el-card>
</template>

<script lang="ts">
import { fetchCategoriesDelete, fetchCategoriesTree } from '@/api'
import { formatCategoriesTree } from '@/utils/tools'
import { ICategoriesTree } from '@/interfaces'

export default {
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      loading: false
    }
  },
  methods: {
    append(data: ICategoriesTree) {
      this.$router.push(`/categories/create/${data.id}`)
    },

    edit(data: ICategoriesTree) {
      this.$router.push(`/categories/edit/${data.id}`)
    },

    remove(node: any, data: ICategoriesTree) {
      ;(this as any)
        .$confirm('此操作将删除该分类以及下级分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          await fetchCategoriesDelete('' + data.id)
          ;(this as any).$message({
            type: 'success',
            center: true,
            showClose: true,
            duration: 1000,
            message: '删除成功!'
          })
          this.fetchData()
        })
        .catch(() => {})
    },

    async fetchData() {
      this.loading = true
      const res = await fetchCategoriesTree()
      // 将获取到的树状结构，递归，将id复制为value，name复制成label
      formatCategoriesTree(res)
      this.loading = false
      this.data = res
    }
  },

  async mounted() {
    this.fetchData()
  }
}
</script>

<style scoped lang="scss">
.top-bar {
  margin: 10px 0 20px;
  h1 {
    font-size: 30px;
    margin: 0;
  }
}
.box-card {
  .options {
    a {
      margin: 0 10px;
      &:hover {
        color: #1da1f2;
      }
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
