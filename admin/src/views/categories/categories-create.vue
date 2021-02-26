<template>
  <el-row class="top-bar" type="flex">
    <h1>创建分类</h1>
  </el-row>
  <el-card class="box-card">
    <div class="box-card-inside">
      <el-form
        :model="formData"
        :rules="rules"
        :status-icon="true"
        ref="formRef"
        label-width="80px"
      >
        <el-form-item label="上级分类" props="parentIdArr">
          <el-cascader
            v-model="formData.parentIdArr"
            @change="checkNameValid()"
            :options="options"
            :props="{ checkStrictly: true, expandTrigger: 'hover' }"
            placeholder="不填默认为根级目录"
            clearable
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input placeholder="请输入分类名称" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, shallowRef } from 'vue'
import { fetchCategoriesTree, fetchCategoriesIsNameVaild, fetchCategoriesCreate } from '@/api'
import { ICreatOneData, IOptions } from '@/interfaces'
import { findRouteFromTreeByValue, formatCategoriesTree } from '@/utils/tools'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'CategoriesCreate',
  props: { id: String },
  setup(props) {
    const router = useRouter()

    const formRef = ref<HTMLElement | null>(null)

    const formData = reactive<ICreatOneData>({
      parentIdArr: null, // null或长度大于0的数组
      name: ''
    })

    const options = shallowRef<IOptions[]>([])
    // const options = reactive<Array<IOptions>>([
    //   {
    //     value: 'id1',
    //     label: '前端',
    //     children: [
    //       {
    //         value: 'id2',
    //         label: 'HTML'
    //       },
    //       {
    //         value: 'id3',
    //         label: 'CSS'
    //       },
    //       {
    //         value: 'frame',
    //         label: '框架',
    //         children: [
    //           {
    //             value: 'Vue',
    //             label: 'Vue'
    //           },
    //           {
    //             value: 'React',
    //             label: 'React'
    //           },
    //           {
    //             value: 'Angular',
    //             label: 'Angular'
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // ])

    const rules = {
      name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        {
          async validator(rule: any, value: any, callback: Function) {
            let parentId = null
            if (formData.parentIdArr !== null) {
              parentId = formData.parentIdArr[formData.parentIdArr.length - 1]
            }
            // 远程验证当前层级名称是否重复
            const isNameVaild = await fetchCategoriesIsNameVaild(formData.name, parentId)
            isNameVaild ? callback() : callback('该分类名称已存在于当前层级')
          },
          trigger: 'blur'
        }
      ]
    }

    // 当分类名称不为''时，再次操作上级分类级联选择框，会再次触发分类名称的校验
    const checkNameValid = () => {
      if (formData.name !== '') {
        ;(formRef.value as any)?.validateField('name')
      }
    }
    onMounted(async () => {
      const treeRes = await fetchCategoriesTree()
      // 将获取到的树状结构，递归，将id:number复制为value:string，name复制成label
      formatCategoriesTree(treeRes)
      options.value = treeRes

      if (props.id) {
        const treeRouteArr = findRouteFromTreeByValue(treeRes, props.id)
        // 添加分类，以点击的那行作为默认的上级分类
        formData.parentIdArr = treeRouteArr
      }
    })

    const onSubmit = () => {
      formRef.value &&
        (formRef.value as any).validate(async (valid: boolean) => {
          if (valid) {
            let parentId = formData.parentIdArr?.[formData.parentIdArr.length - 1] || null
            console.log(formData.name, parentId)
            await fetchCategoriesCreate(formData.name, parentId)
            ElMessage({
              type: 'success',
              center: true,
              showClose: true,
              duration: 1000,
              message: '创建成功'
            })
            router.push('/categories')
          }
        })
    }
    return { options, formData, rules, formRef, onSubmit, checkNameValid }
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
.box-card {
  .box-card-inside {
    display: flex;
    justify-content: center;
  }
  .el-form {
    width: 600px;
    :deep(.el-cascader) {
      width: 300px;
    }
  }
}
</style>
