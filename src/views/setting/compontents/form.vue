<template>
  <el-form label-width="120px" style="margin-top: 50px">
    <el-form-item label="公司名称">
      <el-input v-model="formData.name" disabled style="width: 400px" />
    </el-form-item>
    <el-form-item label="公司地址">
      <el-input v-model="formData.companyAddress" disabled style="width: 400px" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="formData.mailbox" disabled style="width: 400px" />
    </el-form-item>
    <el-form-item label="备注">
      <el-input
        v-model="formData.remarks"
        type="textarea"
        :rows="3"
        disabled
        style="width: 400px"
      />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SetForm',
  props: {
    formData: {
      type: Object,
      required: true
    }
  }
}
</script>
