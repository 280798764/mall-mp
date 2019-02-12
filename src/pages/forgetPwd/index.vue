<template>
  <div class="forget-pwd-container">
    <ul>
      <li class="style-input-li">
        <input class="input-common" type="number"
               placeholder="请输入手机号" v-model="phone" adjust-position="true"/>
      </li>
      <li class="style-input-li picture-sms-code">
        <input class="input-common phone-sms-code" type="text"
               placeholder="请输入图片验证码" adjust-position="true" v-model="pictureVerifyCode"/>
        <img src="$STATIC_URL/ic_vertical_line.png" class="vertical-line-img">
        <img :src="verifyImg" class="picture-code-img" @click="refreshImageVerifyCode">
      </li>
      <li class="style-input-li sms-code">
        <input class="input-common phone-sms-code" type="number"
               placeholder="请输入短信验证码" adjust-position="true" v-model="phoneSmsCode"/>
        <span class="get-phone-sms-code" @click="getPhoneSmsCodeCode">{{smsCodeDesc}}</span>
      </li>
      <li class="style-input-li new-pwd">
        <input class="input-common" type="password"
               placeholder="请输入新密码" adjust-position="true" v-model="newPassword"/>
      </li>
      <li>
        <div class="submit-div" @click="resetPassword">完成</div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { PICTURE_VERIFICATION_CODE_URL, PHONE_SMS_CODE_URL, FORGET_PASSWORD_URL } from "../../api/LoginCgi.js";
  import wxApi from "../../mixins/WxApi.js";
  import UUIDUtils from "../../utils/UUIDUtils.js";

  export default {
    mixins: [wxApi],
    name: "index",
    data() {
      return {
        phone: "",
        keyImageVerifyCode: "boxAppStoreMpImageVerifyKey",
        pictureVerifyCode: "",
        phoneSmsCode: "",
        newPassword: "",
        verifyImg: "",
        smsCodeInterval: 0,
        timeCounter: 60,
        smsCodeDesc: "获取短信验证码"
      };
    },
    onShow() {
      this.refreshImageVerifyCode();
    },
    onUnload() {
      this.resetPage();
    },
    methods: {
      /**
       * 获取图片验证码
       */
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
      setSmsCodeInterval() {
        let _this = this;
        this.smsCodeInterval = setInterval(function() {
          console.log(JSON.stringify(_this.timeCounter));
          if (_this.timeCounter < 1) {
            clearInterval(_this.smsCodeInterval);
            _this.smsCodeDesc = "获取短信验证码";
            _this.timeCounter = 60;
          } else {
            _this.timeCounter -= 1;
            _this.smsCodeDesc = _this.timeCounter + "s后可重发";
          }
        }, 1000);
      },
      /**
       * 获取短信验证码
       */
      getPhoneSmsCodeCode() {
        if (this.phone.trim().length < 1) {
          this.showToast("请输入手机号");
          return;
        }
        if (this.timeCounter !== 60) {
          return;
        }
        let param = { mobile: this.phone };
        this.$api.post(PHONE_SMS_CODE_URL, param).then((backInfo) => {
          if (backInfo.isSuccess) {
            this.showToast("短信验证码已发送~");
            this.setSmsCodeInterval();
            console.log(JSON.stringify(backInfo.content));
          } else {
            this.showToast(backInfo.message);
          }
        });
      },
      /**
       * 重置密码
       */
      resetPassword() {
        if (this.phone.trim().length < 1) {
          this.showToast("请输入手机号");
          return;
        }
        if (this.pictureVerifyCode.trim().length < 1) {
          this.showToast("请输入图片验证码");
          return;
        }
        if (this.phoneSmsCode.trim().length < 1) {
          this.showToast("请输入短信验证码");
          return;
        }
        if (this.newPassword.trim().length < 1) {
          this.showToast("请输入新密码");
          return;
        }
        let param = {
          mobile: this.phone,
          password: this.newPassword,
          verifyKey: this.keyImageVerifyCode,
          verifyValue: this.pictureVerifyCode,
          code: this.phoneSmsCode
        };
        this.$api.post(FORGET_PASSWORD_URL, param).then((backInfo) => {
          if (backInfo.isSuccess) {
            this.showToast("密码重置成功，请登录");
            let _this = this;
            setTimeout(function() {
              _this.$router.goBack();
            }, 1000);
          } else {
            this.showToast(backInfo.message);
          }
        });
      },
      resetPage() {
        this.phone = "";
        this.pictureVerifyCode = "";
        this.phoneSmsCode = "";
        this.newPassword = "";
        this.smsCodeDesc = "获取短信验证码";
        this.timeCounter = 60;
        clearInterval(this.smsCodeInterval);
      }
    }
  };
</script>

<style lang="less" scoped>
  //@formatter:off
  @default-icon-size : 32rpx;
  .forget-pwd-container {
    width: 100vw;
    height: 100vh;
    background: #EDEDED;
    padding-top: 36rpx;

    .style-input-li {
      width: 90%;
      height: 96rpx;
      margin: 0 auto 28rpx;
      border: #E6E6E6 1rpx solid;
      border-radius: 48rpx;
      background: #f9f9f9 url("$STATIC_URL/ic_phone.png") no-repeat 48rpx center;
      background-size: @default-icon-size @default-icon-size;
      margin-bottom: 24rpx;
      .input-common{
        height: 96rpx;
        line-height: 96rpx;
        font-size: 28rpx;
        color: #333333;
        margin-left: 96rpx;
        &.phone-sms-code{
          width: 350rpx;
        }
      }
      &.picture-sms-code{
        background: #f9f9f9 url("$STATIC_URL/ic_image_verify_code.png") no-repeat 48rpx center;
        background-size: @default-icon-size @default-icon-size;
        position: relative;
        .vertical-line-img{
          position: absolute;
          width: 2rpx;
          height: 40rpx;
          top: 50%;
          right: 230rpx;
          margin-top: -20rpx;
        }
        .picture-code-img{
          width: 174rpx;
          height: 66rpx;
          position: absolute;
          right: 36rpx;
          top: 50%;
          margin-top: -33rpx;
        }
      }
      &.sms-code{
        background: #f9f9f9 url("$STATIC_URL/ic_phone_sms_code.png") no-repeat 48rpx center;
        background-size: @default-icon-size @default-icon-size;
        position: relative;
        .get-phone-sms-code{
          position: absolute;
          top: 0;
          right: 36rpx;
          height: 96rpx;
          line-height: 96rpx;
          font-size: 28rpx;
          color: #4C83F0;
          text-align: center;
        }
      }
      &.new-pwd{
        background: #f9f9f9 url("$STATIC_URL/ic_password.png") no-repeat 48rpx center;
        background-size: @default-icon-size @default-icon-size;
      }
    }
    .submit-div{
      background: url('$STATIC_URL/bg_common_submit_btn.png') no-repeat;
      background-size: 100% 100%;
      margin: 12rpx auto;
      width: 95%;
      height: 140rpx;
      line-height: 140rpx;
      text-align: center;
      color: #333333;
      font-size: 28rpx;
    }
  }

</style>
