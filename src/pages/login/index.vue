<template>
  <div class="root-container">
    <div class="bg-container">
      <ul class="ul-content">
        <li class="logo-li">
          <img src="$STATIC_URL/ic_login_logo.png" class="logo-img">
        </li>
        <li class="phone-input-li first">
          <input class="phone-input-input" type="number"
                 placeholder="请输入手机号" adjust-position="true" v-model="phone"/>
        </li>
        <li class="phone-input-li sms-code">
          <input class="phone-input-input sms-code-input" type="text" placeholder="请输入验证码" v-model="verifyValue"/>
          <img src="$STATIC_URL/ic_vertical_line.png" class="vertical-line-img"/>
          <img :src="verifyImg" class="sms-code-img" @click="refreshImageVerifyCode">
        </li>
        <li class="phone-input-li pwd">
          <input class="phone-input-input" placeholder="请输入密码" v-model="password" type="password"
                 adjust-position="true"/>
        </li>
        <li v-if="pageControl.isShowErrorMessage">
          <p class="error-hint-message">{{pageControl.errorMessage}}</p>
        </li>
        <li class="bottom-btn-li">
          <div class="submit-div" @click="loginByPhone">
            登录
          </div>
          <button class="wx-login-div" @getuserinfo="loginByWx" open-type="getUserInfo">微信一键登录</button>
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
  import authorize from "../../mixins/authorize.js";
  import store from "../../store/index";
  import modal from "../../components/modal";
  import UUIDUtils from "../../utils/UUIDUtils.js";
  import {
    LOGIN_BY_UNIONID_URL,
    FIND_MEMBER_INFO_BY_UNIONID_URL,
    GET_UNIONID_URL,
    DECRYPT_URL
  } from "../../api/ApiCgi";

  export default {
    mixins: [wxApi, authorize],
    components: {
      "i-modal": modal
    },
    data() {
      return {
        phone: "",
        password: "",
        verifyImg: "",
        verifyValue: "",
        keyImageVerifyCode: "boxAppStoreMpImageVerifyKey",
        pageControl: {
          isShowErrorMessage: false,
          errorMessage: ""
        },
        userInfo: {
          mobile: "",
          token: "",
          unionid: "",
          memberCode: "",
          memberName: ""
        }
      };
    },

    mounted() {
      // 判断微信授权
      // this.getSetting().then((res) => {
      //   if (res.authSetting["scope.userInfo"]) {
      //     this.getUnionid().then(res => {
      //       // this.loginByWx(res);
      //     }).catch(err => {
      //       console.log(JSON.stringify(err));
      //     });
      //   }
      // });
    },
    onShow() {
      this.refreshImageVerifyCode();
    },
    methods: {
      loginByPhone() {
        if (!this.phone) {
          this.showToast("手机号不能为空");
          return;
        }
        if (!this.verifyValue) {
          this.showToast("验证码不能为空");
          return;
        }
        if (!this.password) {
          this.showToast("密码不能为空");
          return;
        }
        let parameters = {
          loginAccount: this.phone,
          verifyKey: this.keyImageVerifyCode,
          verifyValue: this.verifyValue,
          password: this.password
        };
        this.$api.post(LOGIN_URL, parameters).then((backInfo) => {
          if (backInfo.isSuccess) {
            // backInfo.response.unionid = "12233";
            this.userInfo.token = backInfo.response.token;
            this.userInfo.mobile = backInfo.response.mobile;
            if (backInfo.response.hasOwnProperty("unionid") && backInfo.response.unionid) {
              this.userInfo.unionid = backInfo.response.unionid;
            }
            this.userInfo.memberCode = backInfo.response.memberCode;
            this.userInfo.memberName = backInfo.response.memberName;
            wx.setStorageSync("userInfo", this.userInfo);
            store.commit("userInfo/setUserInfo", this.userInfo);
            this.$router.redirectTo("/pages/boxLists/main");
          } else {
            this.pageControl.isShowErrorMessage = true;
            this.pageControl.errorMessage = backInfo.message;
            this.refreshImageVerifyCode();
          }
        });
      },
      goForgetPwd() {
        this.$router.navigateTo("/pages/forgetPwd/main");
      },
      refreshImageVerifyCode() {
        this.keyImageVerifyCode = UUIDUtils.generateUUID();
        let param = { verifyKey: this.keyImageVerifyCode };
        this.$api.post(PICTURE_VERIFICATION_CODE_URL, param, false).then((backInfo) => {
          if (backInfo.isSuccess) {
            this.verifyImg = "data:image/png;base64," + backInfo.response;
          } else {
            this.showToast(backInfo.message);
          }
        });
      },
      /**
       * 微信一键登录
       * @param e
       */
      loginByWx(e) {
        if (e.mp.detail.userInfo) {
          this.getUnionid().then(response => {
            if (response.isBind) {
              this.loginByUnionId(response.unionid);
            } else {
              this.showToast("请先绑定isesol账号");
              this.$router.navigateTo("/pages/bindWx/main");
            }
          }).catch(err => {
            console.log(JSON.stringify(err));
            this.showToast("登录失败，请稍后再试");
          });
        } else {
          this.showToast("需要微信授权授权以后才能快捷登录");
        }
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
        margin: 200rpx auto 0;

        .submit-div {
          height: 140rpx;
          background: url('$STATIC_URL/bg_common_submit_btn.png') no-repeat;
          background-size: 100% 100%;
          line-height: 140rpx;
          text-align: center;
          color: #333333;
          font-size: 28rpx;
        }

         .wx-login-div {
          height: 140rpx;
          background: url('https://markdown-1258186581.cos.ap-shanghai.myqcloud.com/ic_wx_login.png') no-repeat;
          background-size: 100% 100%;
          line-height: 140rpx;
          text-align: center;
          color: #FDDB33;
          font-size: 28rpx;
        }
        .wx-login-div::after{
          border: none;
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
