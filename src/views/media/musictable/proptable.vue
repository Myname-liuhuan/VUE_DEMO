<template>
  <div class="zb-pro-table">
    <div class="header">
      <SearchForm :columns="baseFormColumns" @submit="onSubmit" @reset="reset" />
    </div>

    <!----------底部---------------------->
    <div class="footer">
      <!-----------工具栏操作工具----------------->
      <div class="operator">
        <slot name="btn"></slot>
      </div>

      <!-- ------------表格--------------->
      <div class="table">
        <el-table
          v-loading="loading"
          class="zb-table"
          :data="data"
          :border="true"
          cell-class-name="table_cell"
          @selection-change="(val) => emit('selection-change', val)"
        >
          <template v-for="item in columns">
            <el-table-column v-if="item.slot" v-bind="{ ...item, ...{ prop: item.name } }">
              <template #default="scope">
                <slot :name="item.name" :item="item" :row="scope.row"></slot>
              </template>
            </el-table-column>
            <el-table-column v-else v-bind="{ ...item, ...{ prop: item.name } }" />
          </template>
        </el-table>
      </div>
      <!-- ------------分页--------------->
      <div class="pagination">
        <el-pagination
          v-model:currentPage="paginationInfo.currentPage"
          :page-size="paginationInfo.pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, PropType, ref } from 'vue'
  import SearchForm from '@/components/SearchForm/index.vue'
  import type { FormInstance } from 'element-plus'
  const emit = defineEmits(['reset', 'onSubmit', 'selection-change'])
  let props = defineProps({
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: () => 0,
    },
    pagination: {
      type: Object as PropType<{ currentPage: number; pageSize: number }>,
      default: () => {
        return {
          currentPage: 1,
          pageSize: 10,
        }
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
    handleCurrentChange: {
      type: Function as PropType<(val: number) => void>,
      required: true,
    },
  })

  // 过滤调需要进行搜索选择的
  const baseFormColumns = computed(() => {
    return props.columns.filter((item) => item.valueType && item.search)
  })

  /**
   * 使用的分页控件里面会有对传入参数操作的情况，为了符合子页面不修改父页面传入参数的vue规范
   * 所以这里封装一个计算属性和父页面传入的数据一样
   */
  const paginationInfo = computed(() => {
    return {
      currentPage: props.pagination.currentPage,
      pageSize: props.pagination.pageSize,
    }
  })

  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
  }

  const onSubmit = (searchParams) => {
    //传递给父组件
    emit('onSubmit', searchParams)
  }

  const reset = (formEl: FormInstance | undefined) => {
    emit('reset')
  }
</script>
<style scoped lang="scss">
  :deep(.table_cell .cell) {
    white-space: nowrap;
  }
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .zb-pro-table {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
      display: flex;
      padding: 10px 10px 0 10px;
      margin-bottom: 10px;
      border-radius: 4px;
      background: white;
      box-shadow: 0 0 12px rgb(0 0 0 / 5%);
      :deep(.advancedForm) {
        flex: 1;
      }
    }
    .footer {
      flex: 1;
      display: flex;
      padding: 10px;
      flex-direction: column;
      border-radius: 4px;
      overflow: hidden;
      background: white;
      box-shadow: 0 0 12px rgb(0 0 0 / 5%);
      min-height: 300px;
      .operator {
        margin-bottom: 10px;
      }
      .table {
        position: relative;
        flex: 1;
      }
      .zb-table {
        position: absolute;
        height: 100%;
      }
    }
    :deep(.el-table__header th) {
      font-size: 15px;
      font-weight: 700;
      color: #252525;
    }
    .pagination {
      width: 100%;
      display: flex;
      justify-content: center;
      padding-top: 20px;
      box-sizing: border-box;
    }
  }
</style>
