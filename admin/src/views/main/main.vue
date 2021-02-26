<template>
  <el-container>
    <el-aside width="250px">
      <h1 class="title">Moonlite控制台</h1>
      <el-menu :default-openeds="['1']" router>
        <el-submenu index="1">
          <template #title><i class="el-icon-s-order"></i>内容管理</template>
          <el-menu-item index="/articles"><i class="el-icon-arrow-right"></i>文章</el-menu-item>
          <el-menu-item index="/categories"><i class="el-icon-arrow-right"></i>分类</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template #title><i class="el-icon-user-solid"></i>用户管理</template>
          <el-menu-item index="/users"><i class="el-icon-arrow-right"></i>用户</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template #title><i class="el-icon-s-comment"></i>评论管理</template>
          <el-menu-item index="/comments"><i class="el-icon-arrow-right"></i>评论</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template #title><i class="el-icon-s-flag"></i>广告管理</template>
          <el-menu-item index="/advertisements"
            ><i class="el-icon-arrow-right"></i>广告</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Main',
  setup() {}
})
</script>

<style scoped lang="scss">
.el-container {
  height: 100%;
  .el-aside {
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
