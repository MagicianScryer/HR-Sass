<template>
  <!-- 放置一个图标 -->
  <div>
    <!-- 放置一个svg的图标 -->
    <svg-icon
      icon-class="fullscreen"
      style="color: #fff; width: 20px; height: 20px"
      @click="changeScreen"
    />
  </div>
</template>

<script>
// import ScreenFull from 'screenfull'

export default {
  data() {
    return {
      flag: null
    }
  },
  methods: {
    //   改变全屏
    changeScreen() {
      if (this.flag === null) {
        document.documentElement.requestFullscreen()
        this.flag = 1
      } else {
        document.exitFullscreen()
        this.flag = null
      }
    }
  }
}
</script>

<style></style>
