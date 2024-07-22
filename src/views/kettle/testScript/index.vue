<template>
  <PageWrapLayout>
    <div style="max-width: 800px">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize">
        <el-form-item label="文件名称" prop="filename">
          <el-input v-model="ruleForm.filename" />
        </el-form-item>
        <el-form-item label="目标库名称" prop="databaseName">
          <el-input v-model="ruleForm.databaseName" />
        </el-form-item>
        <el-form-item label="中间表名称" prop="middleTableName">
          <el-input v-model="ruleForm.middleTableName" />
        </el-form-item>
        <el-form-item label="目标表名称" prop="targetTableName">
          <el-input v-model="ruleForm.targetTableName" />
        </el-form-item>
        <el-form-item v-for="(item, index) in ruleForm.dataCheck" :key="index" label="数量校验" prop="dataCheck">
          <el-input v-model="ruleForm.dataCheck[index]" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">立即创建</el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </PageWrapLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'

  const formSize = ref('default')
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive({
    filename: '',
    databaseName: '',
    middleTableName: '',
    targetTableName: '',
    dataCheck: [],
    valueCheck: [],
  })

  const rules = reactive({
    date2: [],
    desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }],
  })

  const submitForm = async (formEl: FormInstance | undefined) => {
    console.log('--FORM---', ruleForm)
    if (!formEl) return
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }
</script>
