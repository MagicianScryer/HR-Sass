<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="close">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 导入获取角色列表的api
import { getRoleList } from '@/api/setting'
// 获取用户当前角色的api
import { getUserDetailById } from '@/api/user'
// 给员工分配角色的api
import { assignRoles } from '@/api/employees'

export default {
  name: 'RolesPop',
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      list: [], // 角色列表
      roleIds: []
    }
  },
  watch: {
    showRoleDialog: function (val) {
      if (val === true) {
        this.getUserDetailById(this.userId)
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    close() {
      this.roleIds = []
      this.$emit('update:showRoleDialog', false)
    },
    //  获取所有角色
    async getRoleList() {
      const { data: res } = await getRoleList()
      this.list = res.rows
    },
    async getUserDetailById(id) {
      const { data: res } = await getUserDetailById(id)
      this.roleIds = res.roleIds // 赋值本用户的角色
    },
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      //   关闭窗体
      this.close()
    }
  }
}
</script>
