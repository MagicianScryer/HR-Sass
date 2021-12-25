<template>
  <div id="SetTable">
    <el-table border="" :data="list">
      <el-table-column align="center" type="index" label="序号" width="120" />
      <el-table-column align="center" prop="name" label="名称" width="240" />
      <el-table-column align="center" prop="description" label="描述" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="assignPerm(scope.row.id)"
            >分配权限</el-button
          >
          <el-button size="small" type="primary" @click="$emit('showDia', scope.row)"
            >编辑</el-button
          >
          <el-button size="small" type="danger" @click="deletRole(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限的弹出层 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { deleteRole, getRoleDetail, assignPerm } from '@/api/setting'
import { tranListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permisson'
export default {
  name: 'SetTable',
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showPermDialog: false, // 控制分配权限弹层的显示后者隐藏
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null // 用来记录分配角色的id
    }
  },
  methods: {
    // 删除角色
    deletRole(roles) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteRole(roles.id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$emit('update')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 点击分配权限
    // 获取权限点数据 在点击的时候调用 获取权限点数据
    async assignPerm(id) {
      const { data: result } = await getPermissionList()
      this.permData = tranListToTreeData(result, '0') // 转化list到树形数据
      this.roleId = id
      // 应该去获取 这个id的 权限点
      // 有id 就可以 id应该先记录下来
      const { data: res } = await getRoleDetail(id) // permIds是当前角色所拥有的权限点数据
      this.selectCheck = res.permIds // 将当前角色所拥有的权限id赋值
      this.showPermDialog = true
    },
    async btnPermOK() {
      // 调用el-tree的方法
      // console.log(this.$refs.permTree.getCheckedKeys())
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.showPermDialog = false
    }
  }
}
</script>

<style lang="sass" scoped></style>
