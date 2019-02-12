<template>
  <div class="optimize-record-container">
    <div class="top-component" v-show="isLoadOver">
      <detail-head :deliveryParams="deliveryParams"></detail-head>
    </div>

    <div class="content" v-if="isLoadOver">
      <div class="title-div">
        <p class="left-p">刀具编号</p>
        <p class="left-p center-p">效率</p>
        <p class="left-p right-p">优化前/优化后</p>
      </div>
      <div class="list-item" v-for="(item,index) in detailsList" :key="index">
        <p class="item-left-p">{{item.T}}</p>
        <div
          v-bind:class="{'item-center-div':item.optimization_disp_type ===1,'item-center-gray-div':item.optimization_disp_type ===2,'item-center-red-div':item.optimization_disp_type ===0}">
          {{item.optimization_effect}}
        </div>
        <div
          v-bind:class="{'item-right-div':item.optimization_disp_type ===1,'item-right-gray-div':item.optimization_disp_type ===2,'item-right-red-div':item.optimization_disp_type ===0}">
          {{item.time_usage_origin}}
          <div class="horizontal-line-div"></div>
          {{item.time_usage}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import detailHead from "../../components/optimize/OptimizeRecordTopDetail";
  import InputModal from "../../components/InputSerialNumberModal.vue";
  import { MT_OPTIMIZE_DETAIL_URL } from "../../api/AppDetail.js";
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
        deliveryParams: {
          iboxNo: "",
          actName: "",
          isOnline: "",
          aliasName: "",
          finishTime: "",
          program: ""
        },
        detailsList: []
      };
    },
    onLoad(options) {
      this.deliveryParams = options;
      this.getIBoxOptimizeDetail();
    },
    computed: {},
    methods: {
      getIBoxOptimizeDetail() {
        let params = {
          finishTime: this.deliveryParams.finishTime,
          mtNo: this.deliveryParams.iboxNo,
          program: this.deliveryParams.program
        };
        this.$api.post(MT_OPTIMIZE_DETAIL_URL, params).then((backInfo) => {
          if (backInfo.isSuccess) {
            this.detailsList = backInfo.response;
            if (this.detailsList === null || this.detailsList.length < 1) {
              this.showToast("暂无数据，即将返回上一页");
              let _this = this;
              setTimeout(function() {
                _this.$router.goBack();
              }, 1500);
            } else {
              this.isLoadOver = true;
            }
          } else {
            this.showToast(backInfo.message);
          }
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  //@formatter:off
  @default-icon-size: 36rpx;
  .optimize-record-container {
    width: 100vw;
    height: 100vh;
    background: #EDEDED;
    padding-top: 24rpx;
    .top-component{
      width: 94%;
      margin: 0 auto;
    }

    .content{
      width: 94%;
	    box-shadow: 0px 0px 13rpx 0px rgba(165, 165, 165, 0.36);
	    border-radius: 23rpx;
      margin: 24rpx auto;
      background: white;
      padding-bottom: 36rpx;
      .title-div{
        overflow: hidden;
        padding: 0 26rpx;
        font-size: 24rpx;
        color: #333;
        .left-p{
          margin-top: 26rpx;
          display: inline-block;
          float: left;
          margin-left: 32rpx;
          &.center-p{
            margin-left: 120rpx;
          }
           &.right-p{
            margin-left: 150rpx;
          }
        }
      }

      .list-item{
        overflow: hidden;
        padding: 0 26rpx;
        .item-left-p{
          width: 100rpx;
          height: 90rpx;
          line-height: 90rpx;
          text-align: center;
          float: left;
          margin-left: 32rpx;
          font-size: 24rpx;
          color: #333;
        }
        .item-center-div{
          width: 218rpx;
          height: 90rpx;
          line-height:  90rpx;
          vertical-align: middle;
          background: url("$STATIC_URL/ic_time_green.png") no-repeat center;
          background-size: 212rpx 72rpx;
          text-align: center;
          float: left;
          margin-left: 32rpx;
          font-size: 19rpx;
          color: #333;
        }
        .item-center-gray-div{
          width: 218rpx;
          height: 90rpx;
          line-height:  90rpx;
          vertical-align: middle;
          background: url("$STATIC_URL/ic_not_statistics.png") no-repeat center;
          background-size: 212rpx 72rpx;
          text-align: center;
          float: left;
          margin-left: 32rpx;
          font-size: 19rpx;
          color: #333;
        }
        .item-center-red-div{
          width: 218rpx;
          height: 90rpx;
          line-height:  90rpx;
          vertical-align: middle;
          background: url("$STATIC_URL/ic_time_red.png") no-repeat center;
          background-size: 212rpx 72rpx;
          text-align: center;
          float: left;
          margin-left: 32rpx;
          font-size: 19rpx;
          color: #333;
        }
        .item-right-div{
          text-align: center;
          line-height:  90rpx;
          float: left;
          width: 250rpx;
          height: 90rpx;
          background: url("$STATIC_URL/ic_time_green.png") no-repeat center;
          background-size: 212rpx 72rpx;
          margin-left: 20rpx;
          font-size: 19rpx;
          color: #333;
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
        .item-right-gray-div{
          text-align: center;
          line-height:  90rpx;
          float: left;
          width: 250rpx;
          height: 90rpx;
          background: url("$STATIC_URL/ic_not_statistics.png") no-repeat center;
          background-size: 212rpx 72rpx;
          margin-left: 20rpx;
          font-size: 19rpx;
          color: #333;
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
        .item-right-red-div{
          text-align: center;
          line-height:  90rpx;
          float: left;
          width: 250rpx;
          height: 90rpx;
          background: url("$STATIC_URL/ic_time_red.png") no-repeat center;
          background-size: 212rpx 72rpx;
          margin-left: 20rpx;
          font-size: 19rpx;
          color: #333;
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
    }


  }
</style>
