<template>
  <div class="m-info">
    <el-popover width="200px" placement="bottom">
      <template #reference>
        <el-badge :value="1" class="item-info-pop">
          <el-icon class="bell header-icon" style="font-size: 20px"><Bell /></el-icon>
        </el-badge>
      </template>
      <div>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="通知" name="first">
            <div class="item-child"> 通知1：<el-button type="primary" link @click="toGitHub('https://www.baidu.com')">链接</el-button></div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import type { TabsPaneContext } from 'element-plus'

  const activeName = ref('first')
  const toGitHub = (link) => {
    window.open(link)
  }
  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
</script>

<style lang="scss" scoped>
  .m-info {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    .item-info-pop {
      display: flex;
      align-items: center;
    }
    .bell {
      color: black;
    }
    .item-child {
      display: flex;
      align-items: center;
      font-size: 13px;
    }
  }
  ::v-deep(.el-divider--horizontal) {
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .transverseMenu {
    .bell {
      color: white;
    }
  }
</style>
