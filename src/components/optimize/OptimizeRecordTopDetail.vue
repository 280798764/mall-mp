<template>
  <div class="optimize-record-top-detail-container">
    <ul class="ul-content">
      <li class="picture-li">
        <img class="picture-li-img" src="$STATIC_URL/ic_box2.png">
      </li>
      <li class="info-li">
        <div>
          <p>{{deliveryParams.iboxNo}}</p>
          <p class="nick-p"><img src="$STATIC_URL/ic_coordinate.png">{{deliveryParams.aliasName}}</p>
        </div>
      </li>
      <li class="status-li">
        <img class="icon-img" src="$STATIC_URL/ic_online.png">
        <span><img class="status-img" src="$STATIC_URL/ic_lamp_green.png" alt="">{{deliveryParams.isOnline=== '1' ? '在线': '离线'}}</span>
      </li>
      <li class="status-li">
        <img class="icon-img" src="$STATIC_URL/ic_equipment.png">
        <span><img class="status-img" src="$STATIC_URL/ic_lamp_green.png" alt="">{{deliveryParams.actName}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "OptimizeRecordTopDetail",
    props: {
      deliveryParams: {
        iboxNo: "",
        aliasName: "",
        isOnline: "",
        actName: ""
      }
    }
  };
</script>

<style lang="less" scoped>

  //@formatter:off
  .optimize-record-top-detail-container {
    height: 164rpx;
    background-color: #ffffff;
	  box-shadow: 0px 0px 13rpx 0px rgba(165, 165, 165, 0.36);
	  border-radius: 22rpx;
    margin: 0 auto;
    padding: 0 12rpx 0 24rpx;
    overflow: hidden;
    .ul-content{
      li{
        float: left;
        &.picture-li{
          height: 164rpx;
          width: 155rpx;
          text-align: center;
          align-items: center;
          display: flex;
          .picture-li-img{
            width: 155rpx;
            height: 114rpx;
          }
        }
        &.info-li{
          width: 252rpx;
          margin: 42rpx 0 0 38rpx;
          letter-spacing: 1rpx;
	        color: #535353;
          font-size: 28rpx;
          .nick-p{
            margin-top: 6rpx;
            img{
              width: 22rpx;
              height: 28rpx;
              vertical-align: middle;
              margin-right: 12rpx;
            }
          }
        }
        &.status-li{
          height: 164rpx;
          padding-top: 40rpx;
          width: 110rpx;
          display: flex;
          align-items: center;
          text-align: center;
          flex-direction:column;
          font-size: 18rpx;
          color: #535353;
          .icon-img{
            width: 53rpx;
            height: 53rpx;
          }
          .status-img{
            vertical-align: middle;
            width: 32rpx;
            height: 32rpx;
          }
          span{
            margin-top: 8rpx;
          }
        }
      }

    }

  }
</style>
