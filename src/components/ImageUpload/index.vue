<template>
  <div class="imgUp">
    <el-upload
      action="#"
      list-type="picture-card"
      :limit="1"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :on-change="changeFile"
      :http-request="upload"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img width="100%" :src="imgUrl" alt="" />
    </el-dialog>
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDkI7k7E3cuvf9ON4UxA6k9IBn8C1ZnoZ3', // 身份识别 ID
  SecretKey: 'FCtKTM0MRFm20h7HBoAG4bstd6ICpCI7' // 身份密钥
})
export default {
  name: 'ImgUP',
  data() {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      currentFileUid: 0,
      // 上传图片展示进度条
      showPercent: false,
      percent: 0
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.fileList = []
    },
    handlePictureCardPreview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 确定上传id
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some((item) => item === file.type)) {
        //   如果不存在
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false // 上传终止
      }
      // 检查文件大小  5M 1M = 1024KB 1KB = 1024B
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        //   超过了限制的文件大小
        this.$message.error('上传的图片大小不能大于5M')
        return false
      }
      // 已经确定当前上传的就是当前的这个file了
      this.currentFileUid = file.uid
      console.log(file)
      return true // 最后一定要return  true
    },
    upload(params) {
      this.showPercent = true
      if (params.file) {
        cos.putObject(
          {
            Bucket: 'imgs-1308854913', // 存储桶
            Region: 'ap-shanghai', // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
            onProgress: (params) => {
              this.percent = params.percent * 100
            }
          },
          (err, data) => {
            // data返回数据之后 应该如何处理
            if (!err && data.statusCode === 200) {
              this.fileList = this.fileList.map((item) => {
                // 去找谁的uid等于刚刚记录下来的id
                if (item.uid === this.currentFileUid) {
                  // 将成功的地址赋值给原来的url属性
                  return { url: 'http://' + data.Location, upload: true }
                  // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                  // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
                }
                return item
              })
              // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
            }
            setTimeout(() => {
              this.showPercent = false // 隐藏进度条
              this.percent = 0 // 进度归0
            }, 2000)
          }
        )
      }
    },
    changeFile(file, fileList) {
      this.fileList = fileList.map((item) => item)
    }
  }
}
</script>

<style lang="scss">
.disabled {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
