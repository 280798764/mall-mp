<template>
  <div class="common-confirm-dialog-container" catchtouchmove="preventTouchMove" v-show="pageInfo.isShow">
    <div class="mask" @click="clickMask">
      <ul class="content-container-ul">

        <li class="title-li">
          <p class="title-li-p">{{pageInfo.title}}</p>
        </li>

        <li class="message-li">
          <p class="message-li-p">{{pageInfo.content}}</p>
        </li>

        <li class="footer-li" v-if="pageInfo.isConfirmModal">
          <span class="btn left-btn" @click="leftClick">{{pageInfo.leftBtn}}</span>
          <span class="btn right-btn" @click="rightClick">{{pageInfo.rightBtn}}</span>
          <img class="vertical-line" src="$STATIC_URL/ic_vertical_line.png">
        </li>
        <li class="footer-li" v-if="!pageInfo.isConfirmModal">
          <span class="btn close-btn" @click="closeClick">关闭</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CommonConfirmDialog",
    props: {
      pageInfo: {
        isShow: {
          default: true,
          type: Boolean
        },
        title: {
          default: "",
          type: String
        },
        content: {
          default: "",
          type: String
        },
        leftBtn: {
          default: "取消",
          type: String
        },
        rightBtn: {
          default: "确定",
          type: String
        },
        clickMaskHideDialog: {
          default: false,
          type: Boolean
        },
        isConfirmModal: {
          default: true,
          type: Boolean
        },
        data: {
          default: {},
          type: Object
        }
      }
    },
    data() {
      return {};
    },
    methods: {
      clickMask() {
        if (this.pageInfo.clickMaskHideDialog) {
          this.pageInfo.isShow = false;
        }
      },
      leftClick() {
        this.pageInfo.isShow = false;
        this.$emit("resultClick", false, this.pageInfo.data);
      },
      rightClick() {
        this.pageInfo.isShow = false;
        this.$emit("resultClick", true, this.pageInfo.data);
      },
      closeClick() {
        this.pageInfo.isShow = false;
        this.$emit("closeResultClick", true, this.pageInfo.data);
      }
    },
    mounted() {
    }
  };
</script>

<style lang="less" scoped>
  //@formatter:off
  @default-border-radius: 12rpx;
  .common-confirm-dialog-container {
    position: relative;
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .6);
      z-index: 100;

      .content-container-ul {
        min-height: 300rpx;
        width: 75%;
        position: fixed;
        top: 50%;
        left: 50%;
        background: white;
        transform: translate(-50%, -75%);
        z-index: 1000;
        border-radius: @default-border-radius;

        .title-li {
          height: 80rpx;
          background: #FDDB33;
          border-radius: @default-border-radius @default-border-radius 0 0;

          .title-li-p {
            text-align: center;
            line-height: 80rpx;
            font-size: 30rpx;
            color: black;
          }
        }

        .message-li {
          margin: 50rpx auto;
          width: 90%;

          .message-li-p {
            text-align: center;
            font-size: 24rpx;
            color: #878787;
            line-height: 40rpx;
          }
        }

        .footer-li {
          position: relative;
          height: 90rpx;
          border-top: #D0D1D1 1rpx solid;

          .vertical-line {
            width: 1rpx;
            height: 70rpx;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -35rpx;
          }

          .btn {
            width: 50%;
            height: 90rpx;
            text-align: center;
            font-size: 28rpx;
            display: flex;

            &.left-btn {
              display: inline-block;
              color: #333333;
              line-height: 90rpx;
              flex: 1;
            }

            &.right-btn {
              line-height: 90rpx;
              display: inline-block;
              color: #FABF40;
              flex: 1;
            }
            &.close-btn{
              display: block;
              text-align: center;
              width: 100%;
              color: #333333;
              line-height: 90rpx;
            }
          }

        }

      }
    }
  }
</style>
