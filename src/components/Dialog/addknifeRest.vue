<template>
  <div>
    <div class="wx-popup">
    <div class='popup-container'>
      <div class="wx-popup-title">编辑/添加序号</div>
      <div class="wx-popup-con">
        <input type="text" v-model="knifeInfo.knifeType" cursor-spacing="130" placeholder="请输入刀架型号"/>
      </div>
      <div class="wx-popup-btn">
        <div class="btn btn-no" @click="cancelBtn">取消</div>
        <div class="btn btn-ok" @click="addBtn">确定</div>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    knifeInfo: Object
  },
  data () {
    return {
      knifeType: '' 
    }
  },
  mounted () {
    this.knifeType = this.knifeInfo.knifeType
  },
  methods: {
    cancelBtn () {
      this.$emit('cancel', this.knifeType, this.knifeInfo)
    },
    addBtn () {
      this.$emit('saveAdd', this.knifeInfo)
    }
  }
}
</script>
<style scoped>
@import './index.css';
</style>