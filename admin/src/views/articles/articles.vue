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
          :options="options"
          :props="{ checkStrictly: true, expandTrigger: 'hover' }"
          placeholder="分类列表"
          clearable
        >
        </el-cascader>
      </el-col>
    </el-row>
  </div>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"> </el-table-column>
    <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
    <el-table-column prop="address" label="地址"> </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { ICreatOneData, IOptions } from '@/interfaces'
import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  name: 'Articles',
  setup() {
    const value = ref<string>('分类')
    // const cascaderSelectedData = reactive<ICreatOneData>({
    //   parentIdArr: null, // null或长度大于0的数组
    //   name: ''
    // })
    const cascaderSelectedArr = ref<string[] | null>()

    const options = reactive<Array<IOptions>>([
      {
        value: 'id1',
        label: '前端',
        children: [
          {
            value: 'id2',
            label: 'HTML'
          },
          {
            value: 'id3',
            label: 'CSS'
          },
          {
            value: 'frame',
            label: '框架',
            children: [
              {
                value: 'Vue',
                label: 'Vue'
              },
              {
                value: 'React',
                label: 'React'
              },
              {
                value: 'Angular',
                label: 'Angular'
              }
            ]
          }
        ]
      }
    ])
    return { value, options, cascaderSelectedArr }
  }
})
</script>

<style scoped lang="scss">
.top-bar {
  margin: 20px 0;
  h1 {
    font-size: 30px;
    margin: 0;
  }
}
</style>
