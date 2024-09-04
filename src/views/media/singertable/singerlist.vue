<template>
  <div ref="appContainer" class="app-container">
    <PropTable
      :loading="loading"
      :columns="baseColumns"
      :data="list"
      :total="total"
      :pagination="pagination"
      :handle-current-change="handleCurrentChange"
      @selection-change="selectionChange"
      @reset="reset"
      @on-submit="onSubmit"
    >
      <template #btn>
        <div style="display: flex; justify-content: flex-end">
          <el-button type="primary" @click="openDialog(true, null)"
            ><el-icon>
              <plus />
            </el-icon>
            添加</el-button
          >
          <el-button type="danger" @click="batchDelete"
            ><el-icon> <delete /> </el-icon>批量删除</el-button
          >
        </div>
      </template>
      <template #operation="scope">
        <el-button type="primary" size="small" icon="Edit" @click="openDialog(false, scope.row)"> 编辑 </el-button>
        <el-button type="danger" size="small" icon="Delete" @click="deleteById(scope.row)"> 删除 </el-button>
      </template>
    </PropTable>

    <!-- 表中字段详情info页面 -->
    <el-dialog v-model="dialogVisible" :title="title" width="50%">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize">
        <el-form-item label="歌手" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>

        <el-form-item label="诞生日期" prop="birthday">
          <!-- format 格式显示值，value-format格式传给后端的值 -->
          <el-date-picker v-model="ruleForm.birthday" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="ruleForm.sex" placeholder="请选择性别">
            <el-option v-for="item in sexOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="歌手类型" prop="singerType">
          <el-input v-model="ruleForm.singerType" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="handleClose(ruleFormRef)">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="music">
  import { ref, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  import { columns } from './constants'
  const loading = ref(true)
  const appContainer = ref(null)
  import PropTable from './proptable.vue'
  import service from '@/api/request' //封装的axios

  let baseColumns = reactive(columns)
  let list = ref([])
  let total = ref(0)
  const sexOption = [
    { label: '男', value: 0 },
    { label: '女', value: 0 },
    { label: '未知', value: 2 },
  ]

  const formSize = ref('default')
  //用来做表单中字段校验
  const ruleFormRef = ref<FormInstance>()
  //用来存放表单数据
  const ruleForm = reactive({
    id: '',
    name: '',
    birthday: null,
    sex: '',
    singerType: '',
  })
  //表单字段校验规则
  const rules = reactive({
    musicUrl: [{ required: true, message: '请输入音频链接', trigger: 'blur' }],
    imageUrl: [{ required: true, message: '请输入图片链接', trigger: 'blur' }],
  })

  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
  })

  const dialogVisible = ref(false)
  const title = ref('新增')
  const formSelectedData = ref([]) //选择的行数据

  /**
   * info弹窗提交逻辑
   * ruleFormRef用来校验字段，ruleForm用来获取表单数据
   */
  const handleClose = async () => {
    await ruleFormRef.value.validate((valid, fields) => {
      if (valid) {
        //发起新增或者修改请求
        service.post('/media/singer/saveMusicSinger', ruleForm).then((response) => {
          if (response.data.code == 200) {
            ElMessage.success(response.data.message)
            //刷新表格数据
            loadPageList({ ...pagination })
          } else {
            ElMessage.error(response.data.message)
          }
        })
        //关闭弹窗
        closeDialog()
      } else {
        console.log('error submit!', fields)
      }
    })
  }

  //弹窗取消按钮事件
  const closeDialog = () => {
    dialogVisible.value = false
  }

  //弹出弹窗
  const openDialog = (isAdd: boolean, row: any) => {
    //每次打开弹窗的时候都要先清除表单数据
    ruleForm.id = ''
    ruleForm.name = ''
    ruleForm.sex = ''
    ruleForm.birthday = null
    ruleForm.singerType = ''

    if (isAdd) {
      title.value = '新增'
    } else {
      title.value = '编辑'
      ruleForm.id = row.id
      ruleForm.name = row.name
      ruleForm.sex = row.sex
      ruleForm.birthday = row.birthday
      ruleForm.singerType = row.singerType
      // ruleFormRef.value.resetFields()
    }
    dialogVisible.value = true
  }

  //批量删除
  const batchDelete = () => {
    if (!formSelectedData.value.length) {
      return ElMessage.error('未选中任何行')
    }
    ElMessageBox.confirm('你确定要删除选中项吗?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    })
      .then(() => {
        //提取选中行的id为json数组
        let params = []
        for (let i = 0; i < formSelectedData.value.length; i++) {
          params.push({ id: formSelectedData.value[i].id })
        }
        //发起批量删除请求
        service.post('/media/singer/logicalBatchDeleteByIds', params).then((response) => {
          if (response.data.code == 200) {
            ElMessage.success(response.data.message)
            //刷新表格数据
            loadPageList({ ...pagination })
          } else {
            ElMessage.error(response.data.message)
          }
        })
      })
      .catch(() => {})
  }

  //记录选择的行数据
  const selectionChange = (val) => {
    formSelectedData.value = val
  }

  const deleteById = (row) => {
    console.log('row==', row)
    ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    })
      .then(() => {
        //发起删除请求
        service.post('/media/singer/logicalDeleteById', row.id).then((response) => {
          if (response.data.code == 200) {
            ElMessage.success(response.data.message)
            //刷新页面
            loadPageList({ ...pagination })
          } else {
            ElMessage.error(response.data.message)
          }
        })
      })
      .catch(() => {})
  }

  /**
   * 重置按钮
   */
  const reset = () => {
    ElMessage.success('触发重置方法')
    loading.value = true
    loadPageList({ ...pagination })
    loading.value = false
  }

  //查询按钮
  const onSubmit = (searchParams) => {
    ElMessage.success('触发查询方法')
    loading.value = true
    let params = { ...searchParams, ...pagination }
    loadPageList(params)
    loading.value = false
  }

  //绑定框架事件,在上一页和下一页的时候会被调用
  const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
    let params = { pageNum: val, pageSize: pagination.pageSize }
    loadPageList(params)
  }

  onMounted(() => {
    nextTick(() => {
      loadPageList({ ...pagination })
    })
    setTimeout(() => {
      loading.value = false
    }, 500)
  })

  function loadPageList(params) {
    //默认只查未删除的
    params.delFlag = 0
    //get请求参数需要再用一层{}包裹
    service
      .get('/media/singer/pageList', {
        params: params,
      })
      .then((response) => {
        list.value = response.data.data.records
        total.value = response.data.data.total
      })
  }
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }

  .app-container {
    flex: 1;
    display: flex;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
