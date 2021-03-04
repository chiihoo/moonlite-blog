<template>
  <el-container>
    <el-aside width="250px">
      <h1 class="title">Moonlite控制台</h1>
      <el-menu :default-openeds="['1']" :default-active="route.path" router>
        <el-submenu index="1">
          <template #title><i class="el-icon-document"></i>内容管理</template>
          <el-menu-item index="/articles"><i class="el-icon-arrow-right"></i>文章</el-menu-item>
          <el-menu-item index="/categories"><i class="el-icon-arrow-right"></i>分类</el-menu-item>
        </el-submenu>
      </el-menu>
      <div class="setting">
        <el-popover placement="top" trigger="click" v-model:visible="visible">
          <p>确认登出吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="handleLogout">确定</el-button>
          </div>
          <template #reference>
            <el-button icon="el-icon-lock" circle></el-button>
          </template>
        </el-popover>
      </div>
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'Main',
  setup() {
    const router = useRouter()
    const route = useRoute()

    const visible = ref<boolean>(false)

    const handleLogout = () => {
      localStorage.removeItem('access_token')
      router.push('/login')
    }

    return { visible, handleLogout, route }
  }
})
</script>

<style scoped lang="scss">
.el-container {
  height: 100%;
  .el-aside {
    position: relative;
    h1.title {
      margin: 35px 0;
      text-align: center;
    }
    .el-menu {
      border: 0;
      overflow: hidden;
      height: calc(100% - 95px);
      &:hover {
        overflow: auto;
      }
    }
    .setting {
      z-index: 99;
      position: absolute;
      bottom: 0px;
      left: 0;
      right: 0;
      background-color: rgba(246, 251, 254, 0.35);
      text-align: center;
      padding: 10px 0;
      :deep(i) {
        font-size: 30px;
      }
    }
  }
  .el-main {
    background-color: #f6fbfe;
    color: #333;
    margin: 15px 15px 0 0;
    padding: 25px 30px 30px;
    border-radius: 30px;
  }
}
</style>
