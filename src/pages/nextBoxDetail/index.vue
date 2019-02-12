<!-- 只能增效页面 -->
<template>
  <div class="box-detail">
    <div class="detail-head">
      <detail-head></detail-head>
      <div class="detail-img">
        <img :src="appInfo.icon" alt="">
      </div>
      <div class="detail-info">
        <div class="info-title">
          <span class="app-name">{{appInfo.appName}}</span>
          <span>兼容性：{{appInfo.compatibility}}</span>
        </div>
        <div><span>{{appInfo.ownerName}}</span></div>
        <div><span>版本：{{appInfo.version}}</span></div>
        <div><span>更新日期：{{createdTime}}</span></div>
      </div>
    </div>
    <scroll-view class="box" scroll-x="true">
      <view v-if="screenList.length < 1" class="screen-none">暂无截图</view>
      <view class="box-view" v-for="(item, index) in screenList" :key="index">
        <div class="box-image">
          <img :src="item">
        </div>
      </view>
    </scroll-view>
    <div class="detail-describe">
      <p>应用描述</p>
      <p>{{appInfo.description}}</p>
    </div>
    <div class="detail-btn">
      <div class="btn" v-if="appInfo.isYiJian" @click="install('1')">一键安装</div>
      <div class="btn" v-if="appInfo.isUpdate" @click="install('3')">一键更新</div>
      <div class="btn finish" v-if="appInfo.isInstall">已安装</div>
      <div class="btn update-btn" v-if="appInfo.isInstaing">安装中...</div>
      <div class="btn update-btn" v-if="appInfo.isUnInstall">卸载中...</div>
      <div class="btn update-btn" v-if="appInfo.updating">更新中...</div>
    </div>
  </div>
</template>

<script>
import wxApi from "@/mixins/WxApi.js"
import { APPINFO_URL, APPINSTALL_URL, INSTALL_STATUS } from "@/api/AppDetail.js"
export default {
  mixins: [wxApi],
  data() {
    return {
      appInfo: {},
      createdTime: '',
      screenList: [],
      downtimer: null,
      updateText: ''
    }
  },
  mounted() {
    this.getAppInfo()
  },
  onUnload () {
    clearTimeout(this.downtimer)
  },
  methods: {
    getAppStatus () {
      this.downtimer = setTimeout(() => {
        this.getAppInfo()
      }, 10000)
    },
    getAppInfo () {
      let parameters = {
        iboxNo: this.$mp.query.machineNo,
        appNameEn: this.$mp.query.appNameEn,
        version: this.$mp.query.version
      }
      this.$api.post(APPINFO_URL, parameters).then(backInfo => {
        if (backInfo.isSuccess) {
          this.appInfo = backInfo.response
          if (backInfo.response.installStatus !== '1' || backInfo.response.installStatus !== '3') { 
            this.getAppStatus()
          }
          if (this.appInfo.installStatus === '1' ||  this.appInfo.installStatus === '2' || this.appInfo.installStatus === '3') {
            if (this.appInfo.installStatus === '1') {
              this.appInfo.isInstaing = true
            }
            if (this.appInfo.installStatus === '2') {
              this.appInfo.isUnInstall = true
            }
            if (this.appInfo.installStatus === '3') {
              this.appInfo.updating = true
            }
          } else {
            if (this.appInfo.upFlag === '1') {
              this.appInfo.isInstall = true
            }
            if (this.appInfo.upFlag === '2') {
              this.appInfo.isUpdate = true
            }
            if (this.appInfo.upFlag === '3') {
              this.appInfo.isYiJian = true
            }
          }
          let time = backInfo.response.createdTime
          this.screenList = backInfo.response.screenShot.split(';')
          if (time) {
            this.createdTime = time.split(' ')[0]
          }
        }
      })
    },
    // 安装/更新app
    install (flag) {
      let parameters = {
        flag: flag,
        appName: this.appInfo.appNameEn,
        appUrl: this.appInfo.lastFileUrl,
        machineNo: this.appInfo.machineNo,
        owner: this.appInfo.ownerName,
        platform: this.appInfo.platform,
        version: this.appInfo.lastVersion
      }
      this.$api.post(APPINSTALL_URL, parameters).then((backInfo) => {
        if (backInfo.isSuccess) {
          if (flag === '1') {
            this.updateText = '安装中...'
            this.getAppInfo()
          } else if (flag === '3') {
            this.updateText = '更新中...'
            this.getAppInfo()
          }
        } else {
          this.getAppInfo()
          this.showToast(backInfo.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .box-detail {
    padding: 16px 15px 36px 15px;
    font-size: 14px;
  }
  .detail-head {
    display: flex;
    padding: 10px 0;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: #FFF;
    box-shadow: 0 0 10px 3px #e4e4e4;
  }
  .detail-img {
    width: 65px;
    height: 65px;
    margin: 0px 20px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }
  }
  .info-title {
    font-size: 16px;
    span {
      &:nth-of-type(1){
        display: inline-block;
        width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: bolder;
      }
      &:nth-of-type(2){
        position: relative;
        top: -8px;
        display: inline-block;
        padding: 0 10px;
        // text-align: center;
        min-width: 100px;
        font-size: 12px;
        margin-left: 10px;
        border-radius: 30px;
        background-color: #f3f8fd;
        border: solid 1px #777;
      }
    }
  }
  .detail-info > div{
    height: 24px;
    line-height: 24px;
  }
  .detail-info > div:not(:first-child){
    color: #777;
  }
  .box {
    display: flex;
    height: 345px;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    border-radius: 10px;
    padding-top: 15px;
    // padding: 20px 0px;
    margin-bottom: 10px;
    background-color: #FFF;
    box-shadow: 0 0 10px 3px #e4e4e4;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
    }
    .screen-none {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .box-view {
      margin-right: 24px;
      display: inline-block;
      &:first-child {
        margin-left: 20px;
      }
      &:last-child {
        margin-right: 0;
      }
      .box-image {
        width: 175px;
        height: 325px;
        border-radius: 10px;
        background: #ccc;
        img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }
    }
  }
  .detail-describe {
    min-height: 65px;
    padding: 10px 15px;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px 3px #e4e4e4;
    p {
      &:nth-of-type(1) {
        font-size: 20px;
        margin-bottom: 5px;
        font-weight: bold;
      }
      &:nth-of-type(2) {
        color: #535353;
      }
    }
  }
  .detail-btn {
    display: flex;
    padding: 20px 0;
    align-content: center;
    justify-content: center;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px 3px #e4e4e4;
    .btn {
      width: 204px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      border-radius: 30px;
      background-color: #fbe059;
      box-shadow: 0 0 10px 3px #fdf1b3;
    }
    .app-img {
      width: 240px;
      height: 40px;
    }
    .final {
      border: 1px solid #70de2d;
      color: #70de2d;
      background-color: #fff;
      box-shadow: none;
    }
    .update-btn {
      width: 204px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      border-radius: 30px;
      background: url($STATIC_URL/bg_install_update_app.png) no-repeat;
      background-size: cover;
    }
  }
</style>
