<template>
  <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
    <el-form
      ref="roleForm"
      v-loading="loading"
      :model="roleForm"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleForm.name" />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="roleForm.description" />
      </el-form-item>
    </el-form>
    <!-- 底部 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" :disabled="disable" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleDetail, updateRole, addRole } from '@/api/setting'
export default {
  name: 'EditPop',
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    roleId: {
      type: [Object, String, Number],
      default: 0
    }
  },
  data() {
    return {
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      loading: false,
      disable: false
    }
  },
  watch: {
    roleId(val) {
      this.editRole(val)
    }
  },
  methods: {
    // 取消按钮
    btnCancel() {
      this.$emit('update:showDialog', false)
    },
    // 确定按钮
    async btnOK() {
      try {
        this.$refs.roleForm.validate()
        // 只有校验通过的情况下 才会执行await的下方内容
        // roleForm这个对象有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          this.disable = true
          await updateRole(this.roleForm)
        } else {
          // 新增业务
          this.disable = true
          await addRole(this.roleForm)
        }
        // 重新拉取数据
        this.$emit('updateRole')
        this.$message.success('操作成功')
        this.disable = false
        this.btnCancel()
      } catch (error) {
        console.log(error)
        this.disable = false
      }
    },
    // 获取角色详情
    async editRole(id) {
      this.loading = true
      const { data: roleForm } = await getRoleDetail(id)
      this.roleForm = roleForm
      this.loading = false
    }
  }
}
</script>
