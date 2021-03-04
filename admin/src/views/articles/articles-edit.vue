<template>
  <el-row class="top-bar" type="flex">
    <h1>编辑文章</h1>
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
        <el-form-item label="标题" prop="title">
          <el-input placeholder="请输入标题" v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="categories">
          <el-cascader
            v-model="formData.categories"
            :options="options"
            :props="{ checkStrictly: true, expandTrigger: 'hover' }"
            collapse-tags
            :show-all-levels="false"
            placeholder="文章分类"
            clearable
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="封面" prop="coverUrl">
          <el-upload
            class="avatar-uploader"
            :action="baseURL + '/upload'"
            :headers="getAuthHeader()"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="formData.coverUrl" :src="formData.coverUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <v-md-editor v-model="formData.content" height="400px"></v-md-editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">更新</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, shallowRef } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '@/utils/axios'
import { fetchArticleById, fetchArticlesEdit, fetchCategoriesTree } from '@/api'
import { findRouteFromTreeByValue, formatCategoriesTree } from '@/utils/tools'
import { IFormDataArticle, IOptions } from '@/interfaces'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ArticlesEdit',
  props: { id: String },
  setup(props) {
    const router = useRouter()

    const formRef = ref<HTMLElement | null>(null)

    const baseURL = axios.defaults.baseURL

    const formData = reactive<IFormDataArticle>({
      title: '',
      categories: null,
      coverUrl: '', // 封面
      content: ''
    })

    const options = shallowRef<IOptions[]>([])

    const rules = {
      title: [
        { required: true, message: '请输入标题', trigger: 'blur' },
        { max: 100, message: '长度最多100个字符', trigger: 'blur' }
      ],
      content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
    }

    const getAuthHeader = () => {
      return { Authorization: ` Bearer ${localStorage.access_token}` }
    }

    const handleAvatarSuccess = (res: string) => {
      formData.coverUrl = res
    }

    const beforeAvatarUpload = (file: { type: string; size: number }) => {
      const isJNGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJNGorPNG) {
        ElMessage({
          type: 'error',
          center: true,
          showClose: true,
          duration: 1000,
          message: '上传图片只能是 JPG 或 PNG 格式!'
        })
      }
      if (!isLt2M) {
        ElMessage({
          type: 'error',
          center: true,
          showClose: true,
          duration: 1000,
          message: '上传图片大小不能超过 2MB!'
        })
      }
      return isJNGorPNG && isLt2M
    }

    onMounted(async () => {
      const treeRes = await fetchCategoriesTree()
      // 将获取到的树状结构，递归，将id:number复制为value:string，name复制成label
      formatCategoriesTree(treeRes)
      options.value = treeRes

      const res = await fetchArticleById(props.id as string)

      formData.title = res.title
      formData.coverUrl = res.coverUrl
      formData.content = res.content
      formData.categories = findRouteFromTreeByValue(treeRes, res.categoryId)
    })

    const onSubmit = () => {
      formRef.value &&
        (formRef.value as any).validate(async (valid: boolean) => {
          if (valid) {
            await fetchArticlesEdit({
              id: props.id,
              title: formData.title,
              categoryId: formData.categories?.[formData.categories.length - 1],
              coverUrl: formData.coverUrl,
              content: formData.content
            })
            ElMessage({
              type: 'success',
              center: true,
              showClose: true,
              duration: 1000,
              message: '创建成功'
            })
            router.push('/articles')
          }
        })
    }

    return {
      formData,
      rules,
      formRef,
      onSubmit,
      handleAvatarSuccess,
      beforeAvatarUpload,
      baseURL,
      options,
      getAuthHeader
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
.box-card {
  .box-card-inside {
    display: flex;
    justify-content: center;
  }
  .el-form {
    width: 1000px;
    :deep(.el-cascader) {
      width: 300px;
    }
    :deep(.avatar-uploader) {
      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
    }
  }
}
</style>
