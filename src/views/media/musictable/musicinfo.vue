<!-- <template>
   <el-dialog v-model="dialogVisible" :title="title" width="50%">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize">
        <el-form-item label="音频名称" prop="musicName">
          <el-input v-model="ruleForm.musicName" />
        </el-form-item>
        
        <el-form-item label="音频链接" prop="musicUrl">
          <el-input v-model="ruleForm.musicUrl" />
        </el-form-item>
        <el-form-item label="图片链接" prop="imageUrl">
          <el-input v-model="ruleForm.imageUrl" />
        </el-form-item>
        <el-form-item label="缩略图链接" prop="miniImageUrl">
          <el-input v-model="ruleForm.miniImageUrl" />
        </el-form-item>
       <el-form-item label="歌手" prop="singerId">
          <el-select v-model="ruleForm.singerId" placeholder="请选择歌手">
            <el-option v-for="item in singerList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="handleClose(ruleFormRef)">确定</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { PropType, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

let props = defineProps({
  dialogVisible :{
    type: Boolean as PropType<boolean>,
    default: false,
  },
  singerList: {
    type: Array,
    default: () => [],
  },
  rules: {
    type: Object ,
    default: () => {
      return {
        musicName: [{ required: true, message: '请输入音频名称', trigger: 'blur' }],
      }
    }
  },
  ruleForm: {
    type: Object as PropType<{ musicName: string; musicUrl: string; imageUrl: string; miniImageUrl: string; singerId: string }>,
    required: true,
  },
  ruleFormRef: {
    type: Object as PropType<FormInstance>,
    required: true,
  },
  cancelDialog: {
    type: Function as PropType<() => void>,
    required: true,
  },
  handleClose: {
    type: Function as PropType<(val: any) => void>,
    required: true,
  },
  
})

const title = ref('新增')


// <MusicInfo
//      :dialog-visible="dialogVisible"
//      :singer-list="singerList"
//      :rules="rules"
//      :rule-form="ruleForm"
//      :rule-form-ref="ruleFormRef"
//      :cancel-dialog="cancelDialog"
//      :handle-close="handleClose"
//      ></MusicInfo>

</script> -->
