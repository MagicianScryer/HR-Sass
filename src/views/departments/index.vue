<template>
  <div class="departments-container">
    <div class="app-container">
      <!-- 头部结构 -->
      <el-card class="tree-card">
        <!-- 树形组件 -->
        <tree-item :treeNode="company" :isRoot="true"></tree-item>
        <el-tree :data="departs" :props="defaultProps">
          <tree-item
            slot-scope="{ data }"
            :treeNode="data"
            @delDepts="getDepartments()"
          ></tree-item>
        </el-tree>
        <!-- 树形组件 -->
      </el-card>
    </div>
  </div>
</template>

<script>
// 导入树形结构的item
import treeItem from './components/treeItem.vue'
// 导入获取组织架构数据api
import { getDepartment } from '@/api/departments'
// 导入处理树形数据的方法
import { tranListToTreeData } from '@/utils/index'

export default {
  // 组织架构
  name: 'Departments',
  components: {
    treeItem
  },
  data() {
    return {
      departs: [],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      try {
        var { data: res } = await getDepartment()
        console.log(res)
      } catch (err) {
        console.log(err)
      }
      // 赋值为本地
      this.company.name = res.companyName
      this.departs = tranListToTreeData(res.depts, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  font-size: 14px;
  box-shadow: 0 2px 2px 0 rgb(0 0 0 / 10%);
  .el-row {
    .el-col > span {
      font: normal 700 16px '微软雅黑';
    }
  }
}
</style>
