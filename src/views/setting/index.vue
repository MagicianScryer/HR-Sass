<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="showDia = true"
                >新增角色</el-button
              >
            </el-row>
            <!-- 表格 -->
            <set-table :list="list" @update="getRoleList" @showDia="showDialogEdit"></set-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                :current-page="page.page"
                :page-sizes="[2, 4, 6, 10]"
                :page-size="page.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              >
              </el-pagination>
            </el-row>
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 表单 -->
            <set-form :formData="formData"></set-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 编辑角色弹出层 -->
      <edit-pop :showDialog.sync="showDia" :roleId="roleId" @updateRole="getRoleList()"></edit-pop>
    </div>
  </div>
</template>

<script>
import setTable from './compontents/table.vue'
import setForm from './compontents/form.vue'
import editPop from './compontents/editRolePop.vue'
import { getRoleList, getCompanyInfo } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  name: 'Setting',
  components: {
    setTable,
    setForm,
    editPop
  },
  data() {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      },
      formData: {},
      // 是否显示弹出层
      showDia: false,
      // 操作的角色id
      roleId: 0
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 初始数据获取
    async getRoleList() {
      const { data: res } = await getRoleList(this.page)
      this.page.total = res.total
      this.list = res.rows
    },
    // 获取公司信息
    async getCompanyInfo() {
      const { data: formData } = await getCompanyInfo(this.companyId)
      this.formData = formData
    },
    // 分页功能函数
    handleSizeChange(val) {
      this.page.pagesize = val
      this.getRoleList()
    },
    handleCurrentChange(val) {
      this.page.page = val
      this.getRoleList()
    },
    showDialogEdit(roleId) {
      this.roleId = roleId.id
      this.showDia = true
    }
  }
}
</script>

<style lang="sass" scoped></style>
