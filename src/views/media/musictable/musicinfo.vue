<template>
  <div class="music-info">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="音乐名">
        <el-input v-model="searchForm.musicName" placeholder="请输入音乐名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">搜索</el-button>
        <el-button type="primary" @click="openDialog">添加音乐</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表区域 -->
    <el-table :data="musicList" style="width: 100%">
      <el-table-column prop="id" label="ID" width="180"></el-table-column>
      <el-table-column prop="musicName" label="音乐名"></el-table-column>
      <el-table-column prop="singerId" label="歌手ID"></el-table-column>
      <el-table-column prop="musicTimeLength" label="时长(s)"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="viewDetail(scope.row)">查看详情</el-button>
          <el-button type="danger" @click="deleteMusic(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <!-- 详情和添加的对话框 -->
    <el-dialog v-model:visible="isDialogVisible" :title="dialogTitle">
      <el-form :model="formData">
        <el-form-item label="音乐名">
          <el-input v-model="formData.musicName"></el-input>
        </el-form-item>
        <el-form-item label="歌手ID">
          <el-input v-model="formData.singerId"></el-input>
        </el-form-item>
        <el-form-item label="音乐时长">
          <el-input v-model="formData.musicTimeLength" type="number"></el-input>
        </el-form-item>
        <el-form-item label="音乐URL">
          <el-input v-model="formData.musicUrl"></el-input>
        </el-form-item>
        <el-form-item label="图片URL">
          <el-input v-model="formData.imageUrl"></el-input>
        </el-form-item>
        <el-form-item label="缩略图URL">
          <el-input v-model="formData.miniImageUrl"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="isDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        searchForm: {
          musicName: '',
        },
        musicList: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
        },
        isDialogVisible: false,
        dialogTitle: '',
        formData: {
          id: null,
          musicName: '',
          singerId: '',
          musicTimeLength: 0,
          musicUrl: '',
          imageUrl: '',
          miniImageUrl: '',
        },
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      // 获取数据
      fetchData() {
        axios
          .get('/api/media/music/pageList', {
            params: {
              musicName: this.searchForm.musicName,
              page: this.pagination.currentPage,
              size: this.pagination.pageSize,
            },
          })
          .then((response) => {
            this.musicList = response.data.data.records
            this.pagination.total = response.data.total
          })
      },
      // 查看详情
      viewDetail(row) {
        this.dialogTitle = '查看详情'
        this.formData = { ...row }
        this.isDialogVisible = true
      },
      // 打开添加对话框
      openDialog() {
        this.dialogTitle = '添加音乐'
        this.resetForm()
        this.isDialogVisible = true
      },
      // 删除音乐
      deleteMusic(id) {
        axios.delete(`/api/music/${id}`).then(() => {
          this.fetchData()
        })
      },
      // 保存（添加或更新）
      handleSave() {
        if (this.formData.id) {
          // 更新
          axios.put(`/api/music/${this.formData.id}`, this.formData).then(() => {
            this.isDialogVisible = false
            this.fetchData()
          })
        } else {
          // 添加
          axios.post('/api/music', this.formData).then(() => {
            this.isDialogVisible = false
            this.fetchData()
          })
        }
      },
      // 重置表单
      resetForm() {
        this.formData = {
          id: null,
          musicName: '',
          singerId: '',
          musicTimeLength: 0,
          musicUrl: '',
          imageUrl: '',
          miniImageUrl: '',
        }
      },
      // 分页相关
      handleSizeChange(val) {
        this.pagination.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.pagination.currentPage = val
        this.fetchData()
      },
    },
  }
</script>

<style scoped>
  .music-info {
    padding: 20px;
    width: 100%;
    height: 100%;
  }
</style>
