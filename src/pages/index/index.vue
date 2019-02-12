<template>
  <div class="root-container">
    <div class="bg-container">
      <ul class="ul-content">
        <li class="logo-li">
          <img src="$STATIC_URL/ic_login_logo.png" class="logo-img">
        </li>
        <li class="phone-input-li first">
          <input class="phone-input-input" type="number" @focus="bindFocusEvent" @blur="bindBlurEvent"
                 placeholder="请输入手机号" adjust-position="true" v-model="phone"/>
        </li>
        <li class="phone-input-li sms-code" v-show="pageControl.loginErrorCount >= 3">
          <input class="phone-input-input sms-code-input" type="text" placeholder="请输入验证码" v-model="smsCode"/>
          <img src="$STATIC_URL/ic_vertical_line.png" class="vertical-line-img"/>
          <img :src="verifyImg" class="sms-code-img" @click="refreshImageVerifyCode">
        </li>
        <li class="phone-input-li pwd">
          <input class="phone-input-input" placeholder="请输入密码" v-model="password" type="password"
                 @focus="bindFocusEvent"
                 @blur="bindBlurEvent" adjust-position="true"/>
        </li>
        <li v-if="pageControl.isShowErrorMessage">
          <p class="error-hint-message">{{pageControl.errorMessage}}</p>
        </li>
        <li class="bottom-btn-li">
          <div class="submit-div" @click="login">
            登录
          </div>
          <p class="forget-pwd" @click="goForgetPwd">忘记密码？</p>
        </li>
      </ul>
    </div>
  </div>


</template>

<script>
  import {
    LOGIN_URL,
    PICTURE_VERIFICATION_CODE_URL
  } from "../../api/LoginCgi.js";
  import wxApi from "../../mixins/WxApi.js";
  import store from "../../store/index";
  import modal from "../../components/modal";

  export default {
    mixins: [wxApi],
    components: {
      "i-modal": modal
    },
    data() {
      return {
        text: "请输入用户名",
        keyImageVerifyCode: "boxAppStoreMpImageVerifyKey",
        verifyImg: "",
        phone: "",
        password: "",
        smsCode: "",
        pageControl: {
          loginErrorCount: 3,
          isShowErrorMessage: false,
          errorMessage: "",
          bottomMarginStatus: "1"
        }
      };
    },

    mounted() {
      console.log(JSON.stringify(store.state.userInfo));
      console.log(JSON.stringify(wx.getStorageSync("userInfo")));

    },
    onShow() {
      this.refreshImageVerifyCode();
    },
    methods: {
      login() {
        if (this.phone.trim().length === 0) {
          this.showToast("手机号不能为空");
          return;
        }
        if (this.password.trim().length === 0) {
          this.showToast("密码不能为空");
          return;
        }
        var parameters = {
          loginAccount: this.phone,
          password: this.password
        };
        this.$api.post(LOGIN_URL, parameters).then((backInfo) => {
          if (backInfo.isSuccess) {
            console.log(JSON.stringify(backInfo.content));
            wx.setStorageSync("userInfo", backInfo.response);
            store.commit("userInfo/setUserInfo", backInfo.response);
          } else {
            this.showToast(backInfo.message);
          }
        });

      },
      goForgetPwd() {
        store.commit("userInfo/clearUserInfo");
        this.$router.navigateTo("/pages/forgetPwd/main");
      },
      bindFocusEvent() {
        // this.pageControl.bottomMarginStatus = '3'
        // this.errorInfo.isHideLogo = false;
        this.pageControl.px = 40;
        console.log(JSON.stringify(1));
      },
      bindBlurEvent() {
        this.pageControl.px = 276;
        // this.pageControl.bottomMarginStatus = '1'
        // this.errorInfo.isHideLogo = true;
        console.log(JSON.stringify(2));
      },
      refreshImageVerifyCode() {
        let param = { verifyKey: this.keyImageVerifyCode };
        this.$api.post(PICTURE_VERIFICATION_CODE_URL, param, false).then((backInfo) => {
          if (backInfo.isSuccess) {
            console.log(JSON.stringify(backInfo.content));
            this.verifyImg = "data:image/png;base64," + backInfo.response;
          } else {
            this.showToast(backInfo.message);
          }
        });
      }
    },
    computed: {
      computedBottomBtnPosition() {
        let classStl = "bottom-btn-margin-status-one";
        if (this.pageControl.bottomMarginStatus === "3") {
          classStl = "bottom-btn-margin-status-three";
        } else if (this.pageControl.loginErrorCount < 3) {
          classStl = "bottom-btn-margin-status-two";
        }
        return classStl;
      }
    }
  };
</script>

<style lang="less" scoped>
  //@formatter:off
  @default-icon-size: 32rpx;
  .root-container {
    width: 100vw;
    height: 100vh;
    background-color: #EDEDED;

    .bg-container {
      width: 100vw;
      height: 100vh;
      background: url($STATIC_URL/bg_login.png) no-repeat;
      background-size: 100%;

      .ul-content {
        width: 90%;
        margin: 0 auto;

        .logo-li {
          text-align: center;

          .logo-img {
            width: 111px;
            height: 121px;
            margin-top: 66rpx;
            text-align: center;
          }
        }

        .phone-input-li {
          position: relative;
          width: 100%;
          height: 96rpx;
          border: #E6E6E6 1rpx solid;
          border-radius: 48rpx;
          background: #f9f9f9 url("$STATIC_URL/ic_phone.png") no-repeat 48rpx center;
          /*background: #f9f9f9 url("../../images/login_phone_ic.png") no-repeat 48rpx center;*/
          background-size: @default-icon-size @default-icon-size;
          margin-bottom: 24rpx;

          &.first {
            margin-top: -16rpx;
          }

          &.sms-code {
            background: #f9f9f9 url("$STATIC_URL/ic_image_verify_code.png") no-repeat 48rpx center;
            background-size: @default-icon-size @default-icon-size;
          }

          &.pwd {
            background: #f9f9f9 url("$STATIC_URL/ic_password.png") no-repeat 48rpx center;
            background-size: @default-icon-size @default-icon-size;

          }

          .phone-input-input {
            width: 550rpx;
            display: inline-block;
            height: 96rpx;
            line-height: 96rpx;
            font-size: 28rpx;
            color: #333333;
            margin-left: 96rpx;

            &.sms-code-input {
              width: 346rpx;
            }
          }

          .vertical-line-img {
            width: 1rpx;
            height: 40rpx;
            position: absolute;
            right: 230rpx;
            top: 50%;
            margin-top: -20rpx;
          }

          .sms-code-img {
            width: 174rpx;
            height: 66rpx;
            position: absolute;
            right: 36rpx;
            top: 50%;
            margin-top: -33rpx;
          }
        }

        .error-hint-message {
          text-align: center;
          color: #ED4343;
          font-size: 28rpx;
          margin-top: 20rpx
        }
      }

      .bottom-btn-li {
        width: 95%;
        margin: 276rpx auto 0;

        .submit-div {
          height: 140rpx;
          background: url('$STATIC_URL/bg_common_submit_btn.png') no-repeat;
          background-size: 100% 100%;
          line-height: 140rpx;
          text-align: center;
          color: #333333;
          font-size: 28rpx;
        }

        .forget-pwd {
          height: 30rpx;
          line-height: 30rpx;
          font-size: 24rpx;
          color: #4C83F0;
          margin-top: 16rpx;
          text-align: center
        }
      }
    }
  }
</style>
