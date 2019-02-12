<template>
  <div class="wrap-list">
    <detail-head :headInfo="headInfo" :isOnline="baseInfo.isOnline" :actName="baseInfo.actName" :isEdit="true"
                 @showModal="editSilasName = true"></detail-head>
    <div class="alreadyApp">
      <h1>已安装应用</h1>
      <div>
        <swiper indicator-dots>
          <swiper-item v-for="(o, dex) in oldApp" :key="dex">
            <div class="content">
              <div class="content_list" v-for="(app,index) in o" :key="index" @longpress="longpress(app)"
                   @click="redDetail(app)">
                <div class="imgBox">
                  <img :src="app.icon">
                  <div class="red_spot" v-if="!app.haveLastVersion && app.installStatus !== '2'"></div>
                  <div class="loading-installl" v-if="app.installStatus === '2'">卸载中...</div>
                </div>
                <div class="text">{{app.appNameEn}}</div>
              </div>
            </div>
          </swiper-item>
        </swiper>
      </div>
    </div>
    <div class="moreApp">
      <h1>应用市场</h1>
      <div class="more-wrap" v-for="(app, index) in moreApp" :key="index">
        <div class="more-list">
          <div class="more-list-top" @click="goNextBoxDetail(app)">
            <div class="imgBox">
              <img :src="app.icon">
            </div>
            <div class="text">
              <h1>{{app.appName}}</h1>
              <div>{{app.description}}</div>
            </div>
          </div>
          <div class="btn" v-if="app.isYiJian" @click="install(app, '1')">一键安装</div>
          <div class="btn" v-if="app.isUpdate" @click="install(app, '3')">一键更新</div>
          <div class="btn finish" v-if="app.isInstall">已安装</div>
          <div class="btn update-btn" v-if="app.isInstaing">安装中...</div>
          <div class="btn update-btn" v-if="app.isUnInstall">卸载中...</div>
          <div class="btn update-btn" v-if="app.updating">更新中...</div>
        </div>
      </div>
    </div>
    <add-alias-name v-if="editSilasName" @saveAdd="save" @cancel="cancel"></add-alias-name>
    <common-confirm-dialog :pageInfo="dialogPageInfo" @resultClick="dialogClickResult1"
                           @closeResultClick="noUpdate"></common-confirm-dialog>
    <common-confirm-dialog-update :pageInfo="dialogPageInfoUpdate" @resultClick="dialogClickResult"
                                  @closeResultClick="noUpdate"></common-confirm-dialog-update>
    <dialog-uninstall :pageInfo="uninstallDialog" @resultClick="uninstallBtn"
                                  @closeResultClick="noUpdate"></dialog-uninstall>
  </div>
</template>

<script>
  import CommonConfirmDialog from "../../components/CommonModal";
  import CommonConfirmDialogUpdate from "../../components/CommonModal";
  import DialogUninstall from "../../components/CommonModal";
  import detailHead from "@/components/detailHead.vue";
  import {
    OLD_APP,
    MORE_APP,
    UNINSTALL_URL,
    INSTALL_URL,
    UPDATEALIAS_URL,
    INSTERALIAS_URL,
    INSTALL_FLAG
  } from "@/api/LoginCgi.js";
  import wxApi from "@/mixins/WxApi.js";
  import store from "@/store/index";
  import MininsDtail from "@/mixins/MixinsDtail.js";
  import addAliasName from "@/components/Dialog/addAliasName.vue";

  export default {
    mixins: [wxApi, MininsDtail],
    components: {
      detailHead,
      addAliasName,
      CommonConfirmDialog,
      CommonConfirmDialogUpdate,
      DialogUninstall
    },
    data() {
      return {
        baseInfo: {},
        text: '',
        editSilasName: false,
        oldApp: [],
        moreApp: [],
        totalPages: "",
        parameters: {
          iboxNo: ""
        },
        pageInfo: {
          page: 0,
          rows: 8
        },
        pageInfo2: {
          page: 0,
          rows: 1000
        },
        unInstallParams: { // 卸载参数
          appName: "", // app英文名称
          machineNo: "", // 盒子序列号
          owner: "" // 程序开发者
        },
        installParams: { // 安装参数
          appName: "", // app英文名称
          machineNo: "", //  盒子序列号
          owner: "", // 程序开发者
          appUrl: "", // app的url
          platform: "", // 安装的平台
          version: ""
        },
        flagParams: {
          appNameEn: "", // app英文名称
          machineNo: "", //  盒子序列号
          version: "",
          flag: ""
        },
        moreAppFlag: [],// 判断要不要轮巡更多应用接口
        refershApp: [], // 是否有卸载中的数据
        dialogPageInfo: {
          isShow: false,
          title: "提示",
          content: "应用正在卸载，无法查看详情！",
          leftBtn: "取消",
          rightBtn: "确定",
          clickMaskHideDialog: false,
          isConfirmModal: true
        },
        dialogPageInfoUpdate: {
          isShow: false,
          title: "新版本提示",
          content: "应用新版本已发布，是否更新？",
          leftBtn: "取消",
          rightBtn: "确定",
          clickMaskHideDialog: false,
          isConfirmModal: true,
          data: {}
        },
        uninstallDialog: {
          isShow: false,
          title: "提示",
          content: "卸载此应用？",
          leftBtn: "取消",
          rightBtn: "确定",
          clickMaskHideDialog: false,
          isConfirmModal: true,
          data: {}
        },
        timer: "",
        timer2: ""
      };
    },
    onLoad(options) {
      this.baseInfo = options;
      this.parameters.iboxNo = options.mtNo;
      this.selectAliasByNo();
    },
    onShow() {
      this.getOldApp();
      this.getMoreApp();
    },
    onHide() {
      this.resetPage();
      clearInterval(this.timer);
      clearInterval(this.timer2);
    },
    onUnload() {
      this.resetPage();
      clearInterval(this.timer);
      clearInterval(this.timer2);
    },
    methods: {
      dialogClickResult(is, app) {
        if (is) {
          this.$router.navigateTo("/pages/nextBoxDetail/main", app);
        } else {
          if (app.changeApp === 'adaptive') {
            this.$router.navigateTo("/pages/intelligentSynergy/main", app);
          }
        }
      },
      resetPage() {
        clearInterval(this.timer);
        this.timer = "";
        clearInterval(this.timer2);
        this.timer2 = "";
      },
      // 循环已安装列表
      circulation() {
        console.log("开始     time1 = ", this.timer);
        if (this.timer === "") {
          this.timer = setInterval(() => {
            this.getOldApp();
          }, 5000);
        }
      },
      // 循环更多应用列表
      circulation2() {
        console.log("开始  time2 = ", this.timer2);
        if (this.timer2 === "") {
          this.timer2 = setInterval(() => {
            this.getMoreApp();
          }, 5000);
        }
      },
      // 获取已安装应用列表
      getOldApp() {
        this.$api.postList(OLD_APP, this.parameters, this.pageInfo, this.timer === "").then((backInfo) => {
          if (backInfo.isSuccess) {
            this.oldApp = backInfo.response || [];
            this.totalPages = backInfo.response.totalPages || "";
            for (let i = 0; i < backInfo.response.length; i++) {
              this.refershApp = backInfo.response[i].filter(item => {
                return item.installStatus === "2";
              });
            }
          } else {
            this.showToast(backInfo.message);
          }
        }).then(res => {
          if (this.refershApp.length) {
            this.circulation();
          }
        });
      },
      getMoreApp() {
        // 获取更多应用列表
        this.$api.postList(MORE_APP, this.parameters, this.pageInfo2, this.timer === "").then((backInfo) => {
          if (backInfo.isSuccess) {
            this.moreApp = backInfo.response.list || [];
            for (let item of this.moreApp) {
              if (item.installStatus === '1' ||  item.installStatus === '2' || item.installStatus === '3') {
                if (item.installStatus === '1') {
                  item.isInstaing = true
                }
                if (item.installStatus === '2') {
                  item.isUnInstall = true
                }
                if (item.installStatus === '3') {
                  item.updating = true
                }
              } else {
                if (item.upFlag === '1') {
                  item.isInstall = true
                }
                if (item.upFlag === '2') {
                  item.isUpdate = true
                }
                if (item.upFlag === '3') {
                  item.isYiJian = true
                }
              }
            }
            this.totalPages = backInfo.response.totalPages || "";
            this.moreAppFlag = this.moreApp.filter((item) => {
              return item.installStatus === "1" || item.installStatus === "3";
            });
          } else {
            this.showToast(backInfo.message);
          }
        }).then(res => {
          if (this.moreAppFlag.length) {
            this.circulation2();
          }
        });
      },
      // 查看已安装应用的详情
      redDetail(app) {
        if (!app.haveLastVersion && app.installStatus !== "2") {
          let name = app.appNameEn;
          let lastVersion = app.lastVersion;
          this.dialogPageInfoUpdate.data = app;
          this.dialogPageInfoUpdate.isShow = true;
        } else if (app.installStatus !== "2" && app.changeApp === 'adaptive') {
          this.$router.navigateTo("/pages/intelligentSynergy/main", app);
        } else if (app.installStatus === "2"){
          this.dialogPageInfo.isShow = true;
        }
      },
      // 跳转应用详情
      goNextBoxDetail(app) {
        this.$router.navigateTo("/pages/nextBoxDetail/main", app);
      },
      // 安装
      install(app, isInstall) {
        for (let item in this.installParams) {
          this.installParams[item] = app[item] || "";
        }
        this.installParams.owner = app.ownerName;
        this.installParams.appName = app.nameEn;
        this.installParams.appUrl = app.lastFileUrl;
        this.installParams.flag = isInstall;
        this.$api.post(INSTALL_URL, this.installParams).then((backInfo) => {
          if (backInfo.isSuccess) {
            this.getMoreApp();
          } else {
            this.showToast(backInfo.message);
          }
        });
      },
      // 卸载
      unInstall(app, unInstallParams) {
        this.flagParams.appNameEn = app.appNameEn || "";
        this.flagParams.machineNo = app.machineNo || "";
        this.flagParams.version = app.version || "";
        this.flagParams.flag = 2;
        this.$api.post(UNINSTALL_URL, unInstallParams).then((backInfo) => {
            if (backInfo.isSuccess) {
              if (this.flagParams.flag === 2) {
                this.getOldApp();
              } else {
                this.getMoreApp();
              }
            } else {
              this.showToast(backInfo.message);
            }
          },
          rej => {
            this.showToast(rej.errorInfo);
          }
        );
      },
      save(nameInfo) {
        let params = {
          aliasName: nameInfo.aliasName
        };
        if (nameInfo.id) {
          params.id = nameInfo.id;
        } else {
          params.iboxNo = this.parameters.iboxNo;
        }
        let url = nameInfo.id ? UPDATEALIAS_URL : INSTERALIAS_URL;
        this.$api.post(url, params).then((backInfo) => {
          if (backInfo.isSuccess) {
            this.editSilasName = false;
            this.selectAliasByNo();
          } else {
            this.showToast(backInfo.message);
          }
        });
      },
      cancel(aliasName, nameInfo) {
        this.editSilasName = false;
        nameInfo.aliasName = aliasName;
        store.commit("setNameInfo", nameInfo);
      },
      uninstallBtn(is, app) {
        if(is) {
           this.unInstall(app, this.unInstallParams);
        } else {
        }

      },
      /// 长按
      longpress(app) {
        if (app.installStatus === "2") {
          return;
        }
        this.unInstallParams.appName = app.appNameEn;
        this.unInstallParams.machineNo = app.machineNo;
        this.unInstallParams.owner = app.owner;
        this.unInstallParams.version = app.version;
        this.uninstallDialog.isShow = true
        /*wx.showModal({
          title: "提示",
          content: "卸载此应用？",
          success: (res) => {
            if (res.confirm) {
              //这里是点击了确定以后
              this.unInstall(app, this.unInstallParams);
            } else {
              //这里是点击了取消以后
            }
          }
        });*/
      }
    }
  };
</script>

<style lang="less" scoped>
  .wrap-list {
    padding: 10px;
    width: 100%;
    overflow: auto;
    /*height: 100vh;*/
    background-color: #EDEDED;
    box-sizing: border-box;
    overflow: auto;

    h1 {
      font-size: 15px;
      color: #333333;
      font-weight: bold;
    }

    .alreadyApp {
      width: 100%;
      background-color: #fff;
      height: 260px;
      border-radius: 5px;
      padding: 15px;
      box-sizing: border-box;

      ._swiper {
        height: 220px !important;
      }

      .content {
        padding-top: 10px;
        width: 100%;
        /*display: flex;*/

        .content_list {

          float: left;
          padding: 5px;
          box-sizing: border-box;
          width: 25%;

          .imgBox {
            position: relative;
            margin: 0 auto;
            width: 55px;
            height: 55px;
            background-color: #eee;
            border-radius: 3px;

            .red_spot {
              position: absolute;
              right: -5px;
              top: -5px;
              width: 10px;
              height: 10px;
              background-color: red;
              border-radius: 50%;
            }

            img {
              width: 100%;
              height: 100%;
            }
          }

          .loading-installl {
            position: absolute;
            top: 0;
            left: 0;
            width: 55px;
            height: 55px;
            line-height: 55px;
            background-color: #eee;
            border-radius: 3px;
            font-size: 12px;
            text-align: center;
          }

          .text {
            width: 100%;
            text-align: center;
            font-size: 15px;
            height: 30px;
            line-height: 30px;
          }
        }
      }
    }

    .content_list .text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .moreApp {
      margin-top: 10px;
      width: 100%;
      background-color: #fff;
      /*height: 400px;*/
      border-radius: 5px;
      padding: 20px;
      box-sizing: border-box;

      .more-list {
        padding: 15px 10px;
        background-color: #FFF;
        border-bottom: 1px solid #f3f3f3;
        box-sizing: border-box;

        .more-list-top {
          display: flex;
          padding: 5px;

          .imgBox {
            margin-right: 15px;

            img {
              width: 55px;
              height: 55px;
            }
          }

          .text {
            .h1 {
              font-weight: bold;
              font-size: 13px;
              margin-bottom: 3px;
              color: #333333;
            }

            div {
              font-size: 12px;
              height: 38px;
              line-height: 18px;
              color: #535353;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }
        }

        .btn {
          width: 70%;
          height: 35px;
          line-height: 35px;
          font-size: 12px;
          margin: 10px auto;
          background-color: #fbe059;
          border-radius: 35px;
          margin-top: 5px;
          text-align: center;
          color: #333333;
          /*box-shadow: 1px 1px 4px #fbe059;*/
          box-shadow: 0 0 10px 3px #fdf1b3;
        }

        .finish {
          border: 1px solid #70de2d;
          color: #70de2d;
          background-color: #fff;
          box-shadow: none;
          /*box-shadow: 1px 1px 4px #70de2d;*/
          /*box-shadow: 0 0 10px 3px #70de2d;*/
        }

        .loading {
          background-color: #fff;
          background-color: pink;
          box-shadow: none;
        }

        .update-btn {
          background: url($STATIC_URL/bg_install_update_app.png) no-repeat;
          background-size: cover;
        }
      }
    }
  }
</style>
