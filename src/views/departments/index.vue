<template>
  <div v-loading="loading" class="departments-container">
    <div class="app-container">
      <!-- 头部结构 -->
      <el-card class="tree-card">
        <!-- 树形组件 -->
        <tree-item :treeNode="company" :isRoot="true" @addPopShow="showAddDialog"></tree-item>
        <el-tree :data="departs" :props="defaultProps">
          <tree-item
            slot-scope="{ data }"
            :treeNode="data"
            @delDepts="getDepartments()"
            @addPopShow="showAddDialog"
            @editPopShow="editPopShow"
          ></tree-item>
        </el-tree>
        <!-- 树形组件 -->
      </el-card>
    </div>

    <!-- 添加部门弹出层 -->
    <add-pop
      ref="addDept"
      :addShowDialog.sync="showDialog"
      :treeNode="node"
      @addDepts="getDepartments"
    ></add-pop>
  </div>
</template>

<script>
// 导入树形结构的item
import treeItem from './components/treeItem.vue'
// 导入添加部门弹出层组件
import addPop from './components/popAdd.vue'
// 导入获取组织架构数据api
import { getDepartment } from '@/api/departments'
// 导入处理树形数据的方法
import { tranListToTreeData } from '@/utils/index'

export default {
  // 组织架构
  name: 'Departments',
  components: {
    treeItem,
    addPop
  },
  data() {
    return {
      departs: [],
      company: { id: '', name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 控制添加部门弹出层show
      showDialog: false,
      // 点击添加的dom节点
      node: null,
      loading: false // 用来控制进度弹层的显示和隐藏
    }
  },
  mounted() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      try {
        var { data: res } = await getDepartment()
      } catch (err) {
        console.log(err)
        this.loading = false
      }
      // 赋值为本地
      this.company.name = res.companyName
      this.departs = tranListToTreeData(res.depts, '')
      this.loading = false
    },
    // 展示添加部门弹出层
    showAddDialog(node) {
      this.node = node
      this.showDialog = true
    },
    // 展示添加部门弹出窗
    editPopShow(node) {
      this.node = node
      this.showDialog = true
      // 我们需要在这个位置 调用子组件的方法
      // 父组件 调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
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
