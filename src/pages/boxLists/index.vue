<template>
  <div class="wrap-list">
    <div class="wrap-content">
      <!--你要滚动的内容-->
      <div class="list" v-for="(list, index) in lists" :key="index" @click="redDetail(list)">
        <div class="top">
          <span class="icon"><img src="../../../static/images/icon-left-gray.png" v-if="list.isOnline == '0'"></span>
          <span class="icon"><img src="../../../static/images/icon-left-orange.png" v-if="list.isOnline === '1'"></span>
          <span class="boxNo">{{list.mtNo}}</span><span v-if="list.aliasName">({{list.aliasName}})</span>
          <span class="online" :class="{unLine: list.isOnline === '0'}">{{list.isOnline === "1" ? "在线": list.isOnline === "0" ? "离线" : ""}}</span>
        </div>
        <div class="line"></div>
        <div class="bottom">
          <div class="left">
            <div>
              <span v-for="(item, id) in list.appAliasName" :key="id">{{item}}</span>
            </div>
            <div style="margin-left: -18px" v-if="list.appAliasName.length > 3">
              <span>...</span>
            </div>
            <div class="type-wrap">
         <span class="type">
           <img src="../../../static/images/icon-green.png" v-if="list.actName === '正常运行'">
           <img src="../../../static/images/icon-blue.png" v-if="list.actName === '调试运行'">
           <img src="../../../static/images/icon-orange.png" v-if="list.actName === '等待激活'">
           <img src="../../../static/images/icon-red.png" v-if="list.actName === '到期停机'">
           {{list.actName}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="loader-more-hint font-size first" v-show="!hasMoreData && lists.length > 6">没有更多数据了...</div>
      <div class="loader-more-hint font-size" v-show="!lists.length">暂无数据</div>
      <div class="selset" @click="showFilterFun" v-show="lists">
        <div class="spot">{{filterNum}}</div>
      </div>
    </div>
    <!--筛选页-->
    <div class="filter-wrap" catchtouchmove="preventTouchMove" v-if="showFilter">
      <div class="wrap">
        <div class="search">
          <img class="img" src="../../../static/images/ic_search.png">
          <div class="input">
            <input type="text" placeholder="请输入磨盒序列号或别名进行查询" v-model="filterParams.iboxNo">
          </div>
        </div>
        <div class="name-search">
          <div class="title">
            <span></span>
            <span>所属工厂</span>
          </div>
          <div>
            <div class="selectWrap">
              <div class="input" @click="showOptions">{{factoryName}}</div>
              <div class="triangle"></div>
              <div class="optionWrap" v-if="isShow">
                <div class="optionItem" :class="{active: item.facName === factoryName}"
                     v-for="(item, index) in factory" :value="item.facId" @click="selectOption(item)" :key="index">
                  {{item.facName}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="linkState">
          <div class="title">
            <span></span>
            <span>连接状态</span>
          </div>
          <div class="btnWrap">
            <span :class="{bgActive: filterParams.isOnline === '1'}" @click="isOnlineFun('1')">在线</span>
            <span :class="{bgActive: filterParams.isOnline === '0'}" @click="isOnlineFun('0')">离线</span>
          </div>
        </div>
        <div class="linkState">
          <div class="title">
            <span></span>
            <span>业务状态</span>
          </div>
          <div class="btnWrap">
            <span :class="{bgActive: filterParams.rentType === '4'}" @click="getType('4')">正常运行</span>
            <span :class="{bgActive: filterParams.rentType === '1'}" @click="getType('1')">调试运行</span>
            <span :class="{bgActive: filterParams.rentType === '0'}" @click="getType('0')">等待激活</span>
            <span :class="{bgActive: filterParams.rentType === '7'}" class="last" @click="getType('7')">到期停机</span>
            <!--<span class="last">欠费停机</span>-->
          </div>
        </div>
        <div class="bottom">
          <div @click="clearFilters"><img src="../../../static/images/icon-delete.png" alt=""><span>清空</span></div>
          <div class="confire" @click="confirm">确认</div>
        </div>
      </div>
    </div>
    <common-confirm-dialog :pageInfo="dialogPageInfo" @resultClick="dialogClickResult"></common-confirm-dialog>
  </div>
</template>

<script>
  import { IBOX_LIST_URL, FACTORY_URL } from "../../api/LoginCgi.js";
  import wxApi from "../../mixins/WxApi";
  import authorize from "../../mixins/authorize.js";
  import CommonConfirmDialog from "../../components/CommonModal";

  export default {
    mixins: [wxApi, authorize],
    components: {
      "common-confirm-dialog": CommonConfirmDialog
    },
    data() {
      return {
        isLoadOver: false,
        hasMoreData: true,
        factoryName: "全部",
        showFilter: false, // 是否显示筛选条件页
        lists: [],
        filterParams: {
          facId: "", // 所属工厂使用权ID
          iboxNo: "", // 序列号或者别名
          isOnline: "", // 是否在线：1在线，0离线
          rentType: "" // 业务状态
        },
        pageInfo: {
          page: 0,
          rows: 10
        },
        filterNum: 0,
        isShow: false,
        select: "",
        factory: [],// 所属工厂
        dialogPageInfo: {
          isShow: false,
          title: "微信绑定",
          content: "将iSESOL帐号与微信绑定后可进行快速登录，免除帐号、密码输入的繁琐操作，是否绑定？",
          leftBtn: "取消",
          rightBtn: "立即绑定",
          clickMaskHideDialog: false,
          isConfirmModal: true
        }
      };
    },
    mounted() {
      if (!wx.getStorageSync("userInfo").token) {
        this.$router.reLaunch("/pages/login/main");
      }else {
        this.getIboxList();
        this.getFactory();
      }
    },
    /**
     * 页面下拉触底事件的处理函数
     */
    onPullDownRefresh: function() {
      this.pageInfo.page = 0;
      this.getIboxList();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
      if (this.hasMoreData) {
        this.getIboxList();
      }
    },
    methods: {
      // 获取列表
      getIboxList() {
        this.$api.postList(IBOX_LIST_URL, this.filterParams, this.pageInfo).then((backInfo) => {
          wx.stopPullDownRefresh();
          if (backInfo.isSuccess) {
            this.hasMoreData = !backInfo.response.last;
            this.isLoadOver = true;
            if (backInfo.response.content !== []) {
              if (this.pageInfo.page === 0) {
                this.pageInfo.page++;
                this.lists = backInfo.response.content;
              } else {
                this.lists = this.lists.concat(backInfo.response.content);
                if (this.hasMoreData) {
                  this.pageInfo.page++;
                }
              }
            }
          } else {
            this.showToast(backInfo.message);
          }
        });
      },
      // 获取工厂列表
      getFactory() {
        this.$api.post(FACTORY_URL, {}).then((backInfo) => {
          if (backInfo.isSuccess) {
            this.factory = backInfo.response || [];
          } else {
            // console.log(JSON.stringify(backInfo.message));
            this.showToast(backInfo.message);
          }
        });
      },

      // 读取详情
      redDetail(list) {
        this.$router.navigateTo("/pages/boxDetail/main", list);
      },
      showFilterFun() {
        this.showFilter = true;
        wx.setNavigationBarTitle({
          title: "筛选条件",
          success() {
            // console.log(444)
          }
        });
      },


      // 在线状态
      isOnlineFun(state) {
        this.filterParams.isOnline = state;
      },
      // 获取业务状态
      getType(type) {
        this.filterParams.rentType = type;
      },
      // 清空
      clearFilters() {
        for (let item in this.filterParams) {
          this.filterParams[item] = "";
        }
        this.factoryName = "全部";
      },
      // 显示下拉框
      showOptions() {
        this.isShow = !this.isShow;
      },
      // 点击选择option
      selectOption(item) {
        this.factoryName = item.facName;
        this.filterParams.facId = item.facId;
        this.isShow = false;
      },
      // 确认
      confirm() {
        wx.setNavigationBarTitle({
          title: "魔盒列表",
          success() {
            //  console.log(555)
          }
        });
        this.showFilter = false;
        this.filterNum = 0;
        for (let item in this.filterParams) {
          if (this.filterParams[item]) {
            this.filterNum = this.filterNum + 1;
          }
        }
        this.pageInfo.page = 0;
        this.getIboxList();
      },
      dialogClickResult(isConfirm) {
        if (isConfirm) {
          this.$router.navigateTo("/pages/bindWx/main");
        }
        ;
      }
    }
  };
</script>

<style lang="less" scoped>
  .wrap {
    width: 100%;
    height: 100%;
  }

  .wrap-list {
    position: relative;
    width: 100%;
    padding: 10px;
    background-color: #EDEDED;
    box-sizing: border-box;

    .wrap-content {
      width: 100%;
      /*height: 100%;*/
      min-height: 100vh;
    }

    .filter-wrap {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100vh;
      background-color: #fff;
    }
  }

  .loader-more-hint {
    height: 50 rpx;
    line-height: 50 rpx;
    text-align: center;
    color: #666666;
    font-size: 20 rpx;
  }

  .first {
    margin-top: 10px;
  }

  .font-size {
    font-size: 13px;
  }

  .list + .list {
    margin-top: 10px;
  }

  .list {
    position: relative;
    padding: 15px 25px;
    margin: 0 auto;
    width: 100%;
    height: 95px;
    background-color: #fff;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;

    .top {
      height: 30px;
      line-height: 30px;
    }

    .line {
      margin: 3px 0 8px 0;
      width: 100%;
      height: 1px;
      background-color: #f5f5f5;
      transform: scaleY(0.5);
    }

    .icon {
      position: absolute;
      left: 0;
      top: 0px;
      width: 5px;
      height: 36px;
      display: flex;

      img {
        width: 5px;
        height: 36px;
      }
    }

    .boxNo {
      font-weight: bold;
      color: #2c2c2c;
    }

    .online {
      float: right;
      color: #fddb2f;
    }

    .unLine {
      color: #c8c8c8;
    }

    .bottom {
      width: 100%;

      .left {
        width: 100%;

        div {
          float: left;
        }

        div:nth-of-type(1) {
          width: 180px;
          height: 25px;
          overflow: hidden;
        }

        .type-wrap {
          float: right;

          .type {
            margin: 0;
            width: inherit;
            background-color: #fff;
            text-align: right;
            color: #505050;

            img {
              margin-right: 5px;
              width: 20px;
              height: 20px;
              vertical-align: middle;
              margin-top: -2px;
            }
          }
        }
      }

      span {
        display: inline-block;
        color: #5d6e79;
        font-size: 13px;
        width: 50px;
        height: 20px;
        line-height: 20px;
        background-color: #eff8ff;
        text-align: center;
        margin-right: 5px;
        border-radius: 3px;
      }

      span:nth-of-type(4) {
        text-align: left;
        background-color: #fff;
      }
    }
  }

  //@formatter:off
  .selset {
    position: fixed;
    bottom: 40rpx;
    right: 60rpx;
    width: 126rpx;
    height: 126rpx;
    background: url($STATIC_URL/ic_select.png) no-repeat center center;
    -webkit-background-size:120%;
    background-size:120%;
    .spot {
      position: absolute;
      right: 12rpx;
      top: 10rpx;
      font-size: 22rpx;
      width: 36rpx;
      height: 36rpx;
      line-height: 36rpx;
      text-align: center;
      color: #fff;
      background-color: #ff2c3b;
      border-radius: 50%;
    }
  }
/*筛选页样式*/
  .wrap {
    width: 100%;
    height: 100vh;
    overflow: auto;
    .search {
      position: relative;
      width: 100%;
      margin: 0 auto;
      height: 80px;
      background-color: #f0f0f0;
      padding: 15px;
      box-sizing: border-box;
      .img {
        position: absolute;
        left: 15%;
        top: 30px;
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
      .input {
        margin:0 auto;
        width: 90%;
        font-size: 14px;
        border: 1px solid #dfdfdf;
        border-radius: 25px;
        box-sizing: border-box;
        padding-left: 50px;
        background-color: #fff;
        input {
          height: 48px;
          line-height: 50px;
        }
      }
    }
    .name-search {
      font-size: 14px;
      width: 100%;
      border-bottom: 1px dashed #e2e2e2;
      height: 115px;
      background-color: #fff;
      padding-top: 15px;
      input {
        padding-left: 15px;
        margin: 0 auto;
        width: 80%;
        height: 45px;
        line-height: 45px;
        border: 1px solid #eee;
        border-radius: 20px;
        box-sizing: border-box;
        background-color: #f7f7f7;
      }
    }
    .linkState {
      padding: 15px 0;
      border-bottom: 1px dashed #e2e2e2;
      width: 100%;
      background-color: #fff;
    }
    .title {
      font-size: 14px;
      height: 30px;
      line-height: 30px;
      margin-bottom: 10px;
      color: #2d2d2d;
      span:nth-of-type(1) {
        display: inline-block;
        width: 6px;
        height: 6px;
        border: 1px solid #333;
        border-radius: 50%;
        margin: 0 20px 0 40px;
        background-color: #ffe535;
        font-size: 14px;
      }
    }
    .btnWrap {
      padding: 0 0 10px 30px;
      span {
        display: inline-block;
        width: 90px;
        height: 28px;
        line-height: 28px;
        border: 1px solid #dfdfdf;
        text-align: center;
        border-radius: 15px;
        font-size: 14px;
        margin-right: 15px;
        color: #686c6f;
      }
      .bgActive {
        background-color: #ffe886;
        border: 1px solid  #ffe886;
        box-shadow: 0 0 10px 3px #fdf1b3;
      }
    }
    .last {
      margin-top: 10px;
    }
    .bottom {
      padding: 20px;
      font-size: 14px;
      background-color: #fff;
      img {
        margin-right: 10px;
        width: 15px;
        height: 15px;
        vertical-align: middle;
      }
      div {
        margin: 0 auto;
        height: 44px;
        line-height: 44px;
        border: 1px solid #ffe886;
        border-radius: 23px;
        text-align: center;
      }
      div:nth-of-type(1) {
        margin-bottom: 14px;
      }
      .confire {
        background-color: #FDDB33;
      }
    }
  }
  .selectWrap {
    position: relative;
    height: 30px;
    color: #4a4a4a;
    .input {
      padding-left: 15px;
      margin: 0 auto;
      width: 80%;
      height: 45px;
      line-height: 45px;
      border: 1px solid #eee;
      border-radius: 25px;
      box-sizing: border-box;
      background-color: #f7f7f7;
    }
    .triangle {
      position: absolute;
      right: 15%;
      top: 20px;
      width: 0;
      height: 0;
      border-width: 6px;
      border-style: solid;
      border-color: #333 transparent transparent transparent;
    }
  }
  .optionWrap {
    box-shadow: 1px 1px 1px #333;
    width: 80%;
    margin: -10px auto;
    border: 1px solid #eee;
    background-color: #fff;
    border-radius: 5px;
    .optionItem {
      height: 35px;
      line-height: 35px;
      padding-left: 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
    }
    .optionItem:hover {
      background-color: #ffe886;
    }
    .active {
      background-color: #ffe886;
    }
  }
</style>
