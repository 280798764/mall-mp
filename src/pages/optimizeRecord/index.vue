<template>
  <div class="optimize-record-container">
    <div style="height: 24rpx"/>
    <div class="top-component" v-show="isLoadOver">
      <detail-head :deliveryParams="deliveryParams"></detail-head>
    </div>

    <div class="listWrap">
      <div class="item-div" v-for="(item,index) in programs " :key="index"
           @click="goIBoxDetail(item.finish_time,item.program)">
        <div class="top-div">
          <span style="float: left">程序名称：{{item.program}}</span>
          <span style="float: right">时间：{{item.finish_time}}</span>
        </div>
        <div class="bottom-div">
          <div
            v-bind:class="{'left-div':item.optimization_disp_type ===1,'left-gray-div':item.optimization_disp_type ===2,'left-red-div':item.optimization_disp_type ===0}">
            <p class="left-picture-p">{{item.optimization_effect}}</p>
            <p class="desc-p">效率
              <img src="$STATIC_URL/ic_arrow_green.png" v-if="item.optimization_disp_type === 1">
              <img src="$STATIC_URL/ic_horizontal_gray_line_short.png" v-else-if="item.optimization_disp_type === 2">
              <img src="$STATIC_URL/ic_red_down.png" v-else-if="item.optimization_disp_type === 0">
            </p>
          </div>
          <div
            v-bind:class="{'left-div':item.optimization_disp_type ===1,'left-gray-div':item.optimization_disp_type ===2,'left-red-div':item.optimization_disp_type ===0}">
            <div class="left-picture-p">{{item.time_usage_origin}}
              <div class="horizontal-line-div"></div>
              {{item.time_usage}}
            </div>
            <p class="desc-p">优化前/优化后
              <img src="$STATIC_URL/ic_arrow_green.png" v-if="item.optimization_disp_type === 1">
              <img src="$STATIC_URL/ic_horizontal_gray_line_short.png" v-else-if="item.optimization_disp_type === 2">
              <img src="$STATIC_URL/ic_red_down.png" v-else-if="item.optimization_disp_type === 0">
            </p>
          </div>
        </div>
      </div>
      <div class="loader-more-hint" v-show="!hasMoreData&&programs.length">已经到底了...</div>
      <div class="not-has-data-div" v-show="isProgramsEmpty">暂无数据</div>
    </div>

    <input-modal :isShowModal="false"></input-modal>

  </div>
</template>

<script>
  import detailHead from "../../components/optimize/OptimizeRecordTopDetail";
  import InputModal from "../../components/InputSerialNumberModal.vue";
  import { MT_OPTIMIZE_LIST_URL } from "../../api/AppDetail.js";
  import wxApi from "../../mixins/WxApi.js";

  export default {
    mixins: [wxApi],
    name: "index",
    components: {
      "detail-head": detailHead,
      "input-modal": InputModal
    },
    data() {
      return {
        isLoadOver: false,
        isProgramsEmpty: false,
        deliveryParams: {
          iboxNo: "",
          actName: "",
          isOnline: "",
          aliasName: ""
        },
        programs: [],
        hasMoreData: true,
        pageInfo: {
          page: 0,
          rows: 10
        }
      };
    },

    onLoad(options) {
      this.deliveryParams = options;
    },
    mounted() {
      this.getOptimizeList();
    },
    computed: {},
    methods: {
      getOptimizeList() {
        let requestParam = {
          mtNo: this.deliveryParams.iboxNo
        };
        this.$api.postList(MT_OPTIMIZE_LIST_URL, requestParam, this.pageInfo).then((backInfo) => {
          wx.stopPullDownRefresh();
          if (backInfo.isSuccess) {
            this.hasMoreData = backInfo.response.hasNextPage > 0;
            this.isLoadOver = true;
            if (backInfo.response.list.length !== 0) {
              if (this.pageInfo.page === 0) {
                this.pageInfo.page++;
                this.programs = backInfo.response.list;
              } else {
                this.programs = this.programs.concat(backInfo.response.list);
                if (this.hasMoreData) {
                  this.pageInfo.page++;
                }
              }
              this.isProgramsEmpty = false;
            } else {
              if (this.pageInfo.page === 0) {
                this.isProgramsEmpty = true;
              }
            }
          } else {
            this.showToast(backInfo.message);
          }
        });
      },
      //优化详情
      goIBoxDetail(finishTime, program) {
        let deliverParam = this.deliveryParams;
        deliverParam.finishTime = finishTime;
        deliverParam.program = program;
        this.$router.navigateTo("/pages/optimizeRecordDetail/main", deliverParam);
      }
    },
    /**
     * 页面下拉触底事件的处理函数
     */
    onPullDownRefresh: function() {
      this.pageInfo.page = 0;
      this.getOptimizeList();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
      if (this.hasMoreData) {
        this.getOptimizeList();
      }
    }
  };
</script>

<style lang="less" scoped>
  //@formatter:off
  @default-background-color:#EDEDED;
  @default-icon-size: 36rpx;
  .optimize-record-container {
    width: 100vw;
    height: 100vh;
    /*height: 100%;*/
    background: @default-background-color;
    .top-component{
      width: 94%;
      margin: 0 auto ;
    }
    .listWrap{
      width: 94%;
      margin: 12rpx auto;
      background: #ededed;
      .item-div{
        width: 94%;
        background: white;
        font-size: 24rpx;
        color: #333;
        box-shadow: 0 0 13rpx 0 rgba(165,165,165,0.36);
        border-radius: 23rpx;
        margin: 16rpx auto 0;
        padding: 24rpx;
        .top-div{
          overflow: hidden;
        }
        .bottom-div{
          display: flex;
          text-align: center;
          padding: 34rpx 0 0 ;
          .left-div{
            flex: 1;
            .left-picture-p{
              font-size: 18rpx;
              text-align: center;
              height: 72rpx;
              line-height: 72rpx;
              background: url("$STATIC_URL/ic_time_green.png") no-repeat center;
              background-size: 212rpx 72rpx;
              margin-bottom: 12rpx;
              .horizontal-line-div{
                display:inline-block;
                vertical-align:middle;
                margin-bottom:4rpx;
                border-radius: 4rpx;
                width: 46rpx;
                height: 4rpx;
                background: #52d85f
              }
            }
          }
          .left-gray-div{
            flex: 1;
            .left-picture-p{
              font-size: 18rpx;
              text-align: center;
              height: 72rpx;
              line-height: 72rpx;
              background: url("$STATIC_URL/ic_not_statistics.png") no-repeat center;
              background-size: 212rpx 72rpx;
              margin-bottom: 12rpx;
              .horizontal-line-div{
                display:inline-block;
                vertical-align:middle;
                margin-bottom:4rpx;
                border-radius: 4rpx;
                width: 46rpx;
                height: 4rpx;
                background: #d9d9d9
              }
            }
          }
          .left-red-div{
            flex: 1;
            .left-picture-p{
              font-size: 18rpx;
              text-align: center;
              height: 72rpx;
              line-height: 72rpx;
              background: url("$STATIC_URL/ic_time_red.png") no-repeat center;
              background-size: 212rpx 72rpx;
              margin-bottom: 12rpx;
              .horizontal-line-div{
                display:inline-block;
                vertical-align:middle;
                margin-bottom:4rpx;
                border-radius: 4rpx;
                width: 46rpx;
                height: 4rpx;
                background: red
              }
            }
          }
          .right-picture-p{
            background: url("$STATIC_URL/ic_time_green.png") no-repeat center;
            background-size: 212rpx 72rpx;
            margin-bottom: 12rpx;
          }
          .right-picture-gray-p{
            background: url("$STATIC_URL/ic_not_statistics.png") no-repeat center;
            background-size: 212rpx 72rpx;
            margin-bottom: 12rpx;
          }
          .right-picture-red-p{
            background: url("$STATIC_URL/ic_time_green.png") no-repeat center;
            background-size: 212rpx 72rpx;
            margin-bottom: 12rpx;
          }
          .desc-p{
            img{
              margin-left: 6rpx;
              width: 19rpx;
              height: 19rpx;
            }
          }

        }

      }
      .not-has-data-div{
        margin-top: 360rpx;
        background: @default-background-color;
        text-align: center;
        color: #666666;
        font-size: 20rpx;
      }
    }

    .loader-more-hint{
      height: 30rpx;
      line-height: 30rpx;
      text-align: center;
      color: #666666;
      font-size: 20rpx;
      margin-top: 24rpx
    }
  }
</style>
