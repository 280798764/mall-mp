<template>
  <div class="detail-body">
    <div class="detail-title">
      <div>
        <p class="detail-sn">{{headInfo.iboxNo}}</p>
        <p class="model">
          <span>{{headInfo.aliasName}}</span>
          <span @click="edit" v-if="isEdit" class="box-edit"></span>
        </p>
      </div>
      <div class="detail-status">
        <div class="status-div">
          <div class="icon-img icon-online"></div>
          <div>
            <img src="../../static/images/icon-green.png">
            <span>{{isOnline === '0' ? '离线': '在线'}}</span>
          </div>
        </div>
        <div class="status-div">
          <div class="icon-img icon-equipment"></div>
          <div>
            <img src="../../static/images/icon-green.png" v-if="actName === '正常运行'">
            <img src="../../static/images/icon-blue.png" v-if="actName === '调试运行'">
            <img src="../../static/images/icon-orange.png" v-if="actName === '等待激活'">
            <img src="../../static/images/icon-red.png" v-if="actName === '到期停机'">
            <span>{{actName}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/index";
export default {
  props: {
    isEdit: Boolean,
    isOnline: String,
    actName: String,
    headInfo: Object
  },
  methods: {
    edit() {
      this.$emit("showModal", this.headInfo);
      store.commit("setNameInfo", this.headInfo);
    }
  }
};
</script>

<style lang="less" scoped>
.detail-body {
  height: 254px;
  padding: 10px 10px 0;
  margin-bottom: 10px;
  border-radius: 10px;
  background: url($STATIC_URL/ic_box.png) no-repeat 0 50px;
  background-size: 100% 200px;
  background-color: #fff;
  box-shadow: 0 0 10px 3px #e4e4e4;
}
.detail-title {
  display: flex;
  justify-content: space-between;
}
.detail-sn {
  margin-bottom: 10px;
  font-size: 16px;
  color: #535353;
}
.model {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #535353;
  text-indent: 18px;
  background: url($STATIC_URL/ic_coordinate.png) no-repeat 0 4px;
  background-size: 14px 16px;
  span {
    &:nth-of-type(1) {
      display: inline-block;
      width: 80px;
      height: 24px;
      line-height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .box-edit {
    width: 18px;
    height: 18px;
    margin-left: 10px;
    background: url($STATIC_URL/ic_edit.png) no-repeat;
    background-size: cover;
  }
}
.detail-status {
  display: flex;
}
.status-div {
  // width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  span {
    font-size: 12px;
  }
  img {
    width: 20px;
    height: 20px;
    margin-top: 3px;
  }
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.status-div:nth-of-type(1) {
  margin-right: 20px;
}
.icon-img {
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
}
.icon-online {
  background: url($STATIC_URL/ic_online.png) no-repeat;
  background-size: cover;
}
.icon-equipment {
  background: url($STATIC_URL/ic_equipment.png) no-repeat;
  background-size: 30px 30px;
}
</style>
