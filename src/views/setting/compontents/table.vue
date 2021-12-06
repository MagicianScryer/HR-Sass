<template>
  <el-table border="" :data="list">
    <el-table-column align="center" type="index" label="序号" width="120" />
    <el-table-column align="center" prop="name" label="名称" width="240" />
    <el-table-column align="center" prop="description" label="描述" />
    <el-table-column align="center" label="操作">
      <template slot-scope="scope">
        <el-button size="small" type="success">分配权限</el-button>
        <el-button size="small" type="primary" @click="$emit('showDia', scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="deletRole(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { deleteRole } from '@/api/setting'
export default {
  name: 'SetTable',
  props: {
    list: {
      type: Array,
      required: true
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
    }
  }
}
</script>

<style lang="sass" scoped></style>
