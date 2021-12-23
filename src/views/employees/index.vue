<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button type="warning" size="small" @click="$router.push('/import?type=user')"
            >导入</el-button
          >
          <el-button size="small" type="danger" @click="exportData">导出</el-button>
          <el-button size="small" type="primary" @click="addPopShow = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" align="center">
            <template slot-scope="{ row }">
              <img
                slot="reference"
                v-imagerror="errImg"
                :src="row.staffPhoto ? row.staffPhoto : ''"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showQrCode(row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" align="center">
            <!-- 作用域插槽 -->
            <template slot-scope="{ row }">{{ row.timeOfEntry | formatDate }}</template>
          </el-table-column>
          <el-table-column label="账户状态" align="center" sortable="" prop="enableState">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${scope.row.id}`)"
                >查看</el-button
              >
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <add-pop :showDialog.sync="addPopShow"></add-pop>
    <!-- 头像二维码弹出层 -->
    <el-dialog
      title="二维码"
      :visible.sync="showCodeDialog"
      @opened="showQrCode"
      @close="imgUrl = ''"
    >
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
// 引入添加员工组件
import addPop from './components/addPop.vue'
// 将图片生成QR二维码
import QRCode from 'qrcode'

export default {
  // 员工
  name: 'Employees',
  components: {
    addPop
  },
  data() {
    return {
      loading: false,
      list: [], // 接数据的
      // 请求参数
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      // 添加员工弹层显示
      addPopShow: false,
      // 头像请求错误图片
      errImg: require('@/assets/common/bigUserHeader.png'),
      // 二维码弹出层show
      showCodeDialog: false,
      // 二维码图片地址
      imgUrl: '',
      // 节流设置
      flag: null
    }
  },
  mounted() {
    this.getEmployeeLists()
  },
  methods: {
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeLists()
    },
    async getEmployeeLists() {
      // 开启loading
      this.loading = true
      // 发起请求
      const { data: list } = await getEmployeeList(this.page)
      // 获取数据并赋值
      this.list = list.rows
      this.page.total = list.total
      // 关闭loading
      this.loading = false
    },
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async deleteEmployee(val) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(val.id)
        this.getEmployeeLists()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 导出数据
    exportData() {
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // 导出excel
      import('@/vendor/Export2Excel').then(async (excel) => {
        //  excel是引入文件的导出对象
        // 导出  header从哪里来
        // data从哪里来
        // 现在没有一个接口获取所有的数据
        // 获取员工的接口 页码 每页条数    100%  1 10000
        const { data: res } = await getEmployeeList({ page: 1, size: this.page.total })
        const rows = res.rows
        const data = this.formatJson(headers, rows) // 返回的data就是 要导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工资料表',
          multiHeader, // 复杂表头
          merges // 合并选项
        })

        // excel.export_json_to_excel({
        //   header: ['姓名', '工资'],
        //   data: [['张三', 3000], ['李四', 5000]],
        //   filename: '员工工资表'
        // })
        // [{ username: '张三',mobile: 13112345678 }]  => [[]]
        // 要转化 数据结构 还要和表头的顺序对应上
        // 要求转出的标题是中文
      })
    },
    // 将表头数据和数据进行对应
    // [{}]  =>   [[]]
    formatJson(headers, rows) {
      return rows.map((item) => {
        // item是一个对象  { mobile: 132111,username: '张三'  }
        // ["手机号", "姓名", "入职日期" 。。]
        return Object.keys(headers).map((key) => {
          // 需要判断 字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return this.formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find((obj) => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
        // ["132", '张三’， ‘’，‘’，‘’d]
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
      // 需要处理时间格式问题
    },
    // 格式化时间
    formatDate(val) {
      const date = new Date(val)
      const Y = date.getFullYear()
      const M = (date.getMonth() + 1 + '').padStart(2, '0')
      const D = (date.getDate() + '').padStart(2, '0')
      const h = (date.getHours() + '').padStart(2, '0')
      const m = (date.getMinutes() + '').padStart(2, '0')
      const s = (date.getSeconds() + '').padStart(2, '0')
      return `${Y}-${M}-${D} ${h}:${m}:${s}`
    },
    // 生成二维码
    async generateQR(url) {
      try {
        await QRCode.toDataURL(this.$refs.myCanvas, url)
        this.imgUrl = url
      } catch {
        this.$message.warning('二维码获取失败')
      }
    },
    // 显示qr二维码
    showQrCode(url) {
      // url存在的情况下 才弹出层
      this.imgUrl = url
      if (this.imgUrl || this.flag) {
        this.showCodeDialog = true
        // 页面渲染是异步的导致拿不到myCanv
        if (!this.flag) {
          this.$nextTick(() => {
            this.generateQR(this.imgUrl)
            this.flag = setTimeout(() => {
              clearTimeout(this.flag)
              this.flag = null
            }, 1000)
          })
        }
      } else {
        this.$message.warning('无头像请设置后再试')
      }
    }
  }
}
</script>

<style lang="sass" scoped></style>
