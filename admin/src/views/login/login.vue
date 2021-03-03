<template>
  <el-row class="login-wrapper">
    <el-col :md="16" class="main">
      <el-row :gutter="10">
        <el-col>
          <p class="title">Moonlite控制台</p>
          <p class="welcome">欢迎回来，请登录</p>
          <div class="grid-content">
            <el-form :model="loginData" :rules="rules" :status-icon="true" ref="formRef">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="账号" prop="username">
                    <el-input placeholder="请输入账号" v-model="loginData.username"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12"
                  ><el-form-item label="密码" name="password" prop="password">
                    <el-input
                      placeholder="请输入密码"
                      v-model="loginData.password"
                      show-password
                      @keyup.enter="onSubmit('loginData')"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item>
                <el-button type="primary" @click="onSubmit('loginData')" class="login-button"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { fetchLogin } from '@/api'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()

    const formRef = ref<HTMLElement | null>(null)

    const loginData = reactive({
      username: 'admin',
      password: '123456'
    })

    const rules = {
      username: [
        { required: true, message: '请输入账户名称', trigger: 'blur' },
        { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
      ]
    }

    const onSubmit = () => {
      formRef.value &&
        (formRef.value as any).validate(async (valid: boolean) => {
          if (valid) {
            let res = await fetchLogin(loginData.username, loginData.password)
            loginData.username = ''
            loginData.password = ''
            // 存储jwt
            ElMessage({
              type: 'success',
              center: true,
              showClose: true,
              duration: 1000,
              message: '登录成功'
            })
            localStorage.setItem('access_token', res.access_token)
            router.push('/articles')
          }
        })
    }

    return { formRef, loginData, rules, onSubmit }
  }
})
</script>

<style scoped lang="scss">
.login-wrapper {
  height: 100%;
  background-color: #f6fbfe;
}
.main {
  padding: 20px 40px 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  .title {
    font-size: 26px;
    font-weight: 700;
  }
  .welcome {
    font-size: 18px;
  }
  .grid-content {
    padding-top: 80px;
    .login-button {
      width: 200px;
      margin-top: 30px;
    }
  }
}
@media (max-width: 991px) {
  .main {
    padding: 20px 20px 0;
  }
}
@media (max-width: 767px) {
  .login-button {
    width: 100% !important;
  }
}
</style>
