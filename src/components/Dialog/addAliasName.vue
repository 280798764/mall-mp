<template>
  <div>
    <div class="wx-popup">
    <div class='popup-container'>
      <div class="wx-popup-title">新增/编辑别名</div>
      <div class="wx-popup-con">
        <input type="text" v-model="nameInfo.aliasName" cursor-spacing="130" placeholder="请输入别名"/>
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
import store from '@/store/index'
export default {
  computed: {
    nameInfo () {
      return store.state.SliasNameInfo.nameInfo
    }
  },
  data () {
    return {
      aliasName: ''
    }
  },
  mounted () {
    this.aliasName = this.nameInfo.aliasName
  },
  methods: {
    cancelBtn () {
      this.$emit('cancel', this.aliasName, this.nameInfo)
    },
    addBtn () {
      this.$emit('saveAdd', this.nameInfo)
    }
  }
}
</script>
<style scoped>
@import './index.css';
</style>