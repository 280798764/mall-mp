<template>
  <div class="root-container" v-if="isShowModal" catchtouchmove="preventTouchMove">
    <div class="input-modal-mask" @click="clickMask">
      <div class="input-modal-container">
        <h1 class="input-modal-title">我是标题</h1>
        <div class="input-modal-content">
          <span class="line-title">别名：</span>
          <input class="input-class" placeholder="请输入别名" v-model="serialNumber" autofocus="autofocus"/>
        </div>
        <div class="input-modal-footer">
          <span class="footer-left" @click="confirm(false)">取消</span>
          <span class="footer-right" @click="confirm(1===1)">确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      serialNumber:'',
      isShowModal: {
        default: false,
        type: Boolean
      },
      isCanCancelClickMask: {
        default: true,
        type: Boolean
      }
    },
    name: "InputModal",
    mounted() {
      console.log(JSON.stringify("009-09"));
    },
    methods: {
      clickMask() {
        if (this.isCanCancelClickMask) {
          this.isShowModal = false;
        }
      },
      confirm(isCancel){
        this.isShowModal = false
        console.log(JSON.stringify(isCancel))
        console.log(JSON.stringify(typeof isCancel))
        this.$emit('confirm',isCancel)
      }
    }
  };
</script>

<style lang="less" scoped>
  @default-color: #fabf40;
  @font-size: 12px;
  @default-title-font-size: 24px;
  .root-container {
    position: relative;
    .input-modal-mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .6);
      z-index: 100;

      .input-modal-container {
        background: white;
        position: fixed;
        top: 50%;
        left: 50%;
        width: 90%;
        transform: translate(-50%, -75%);
        z-index: 1000;
        min-height: 160px;
        text-align: center;
        max-width: 300px;
        border-radius: 8px;
        overflow: hidden;

        .input-modal-title {
          font-size: 20px;
          height: 48px;
          text-align: center;
          line-height: 48px;
        }

        .input-modal-content {
          overflow: hidden;
          margin: auto;
          width: 88%;


          .line-title {
            float: left;
            display: inline-block;
            height: 36px;
            line-height: 36px;
            text-align: center;

          }

          .input-class {
            float: left;
            display: inline-block;
            height: 36px;
            line-height: 36px;
            width: 70%;
            text-align: left;
            border-bottom: solid 0.5px #EAEAEA;
          }
        }

        .input-modal-footer {
          width: 100%;
          margin-top: 42px;
          display: flex;
          height: 48px;
          line-height: 48px;

          .footer-left {
            background: red;
            display: inline-block;
            flex: 1;
          }

          .footer-right {
            display: inline-block;
            flex: 1;
            background: pink;
          }
        }
      }
    }
  }
</style>
