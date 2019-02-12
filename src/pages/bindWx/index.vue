<template>
  <div class="bind-wx-container">
    <div class="top-pic"></div>

    <ul v-if="pageControl.pageStatus ===1">
      <li class="input-common-li phone-li">
        <input class="common-input" placeholder="请输入手机号" v-model="phone"/>
      </li>
      <li class="input-common-li sms-code-li">
        <input class="common-input sms-code" placeholder="请输入短信验证码" v-model="smsCode"/>
        <span class="send-sms-code" @click="getPhoneSmsCodeCode">{{smsCodeDesc}}</span>
      </li>
      <li>
        <div class="submit-div" @click="bind">绑定</div>
      </li>
    </ul>

    <ul v-else class="status-ul">
      <li class="status-icon">
        <img :src="currentStatusIcon" class="icon">
        <p class="status-message">{{currentStatusMessage}}</p>
        <p class="status-hint">{{currentStatusHint}}</p>
      </li>
      <li>
        <div class="submit-div" @click="confirmClick">确定</div>
      </li>
      <li v-if="pageControl.pageStatus ===3">
        <div class="cancel-div" @click="cancelBind">暂不绑定</div>
      </li>
    </ul>
    <common-confirm-dialog :pageInfo="dialogPageInfo" @result="dialogClickResult"></common-confirm-dialog>
  </div>
</template>

<script>
  import CommonConfirmDialog from "../../components/CommonModal";
  import InputModal from "../../components/InputSerialNumberModal.vue";
  import { BIND_UNIONID_URL, GET_UNIONID_URL, DECRYPT_URL } from "../../api/ApiCgi";
  import { PHONE_SMS_CODE_URL } from "../../api/LoginCgi.js";
  import wxApi from "../../mixins/WxApi.js";
  import authorize from "../../mixins/authorize.js";

  export default {
    name: "index",
    mixins: [wxApi, authorize],
    components: {
      "common-confirm-dialog": CommonConfirmDialog,
      "input-modal": InputModal
    },
    data() {
      return {
        phone: "",
        smsCode: "",
        smsCodeInterval: 0,
        timeCounter: 60,
        smsCodeDesc: "发送验证码",
        pageControl: {
          //1 绑定页面 2 绑定成功 3 绑定失败
          pageStatus: 1
        },
        encryptedData: "",
        iv: "",
        dialogPageInfo: {
          title: "微信绑定",
          content: "将iSESOL帐号与微信绑定后可进行快速登录，免除帐号、密码输入的繁琐操作，是否绑定？",
          leftBtn: "取消",
          rightBtn: "立即绑定",
          clickMaskHideDialog: false,
          isConfirmModal: true
        }
      };
    },
    computed: {
      currentStatusIcon() {
        return this.pageControl.pageStatus === 2 ? "$STATIC_URL/ic_bind_success_ic.png" : "$STATIC_URL/ic_bind_fail_ic.png";
      },
      currentStatusMessage() {
        return this.pageControl.pageStatus === 2 ? "绑定成功" : "绑定失败";
      },
      currentStatusHint() {
        return this.pageControl.pageStatus === 2 ? "iSESOL网帐号与微信帐号已成功绑定，" +
          "立即享受极速登录体验。" : "失败原因：运营者身份证信息错误；申请认证资料重填三次都" +
          "不符合规范；企业没有在工商局合法注册。";
      }
    },
    methods: {
      /**
       * 获取手机验证码
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
      setSmsCodeInterval() {
        let _this = this;
        this.smsCodeInterval = setInterval(function() {
          console.log(JSON.stringify(_this.timeCounter));
          if (_this.timeCounter < 1) {
            clearInterval(_this.smsCodeInterval);
            _this.smsCodeDesc = "发送验证码";
            _this.timeCounter = 60;
          } else {
            _this.timeCounter -= 1;
            _this.smsCodeDesc = _this.timeCounter + "s后重发";
          }
        }, 1000);
      },
      /**
       * 确定按钮
       */
      confirmClick() {
        if (this.pageControl.pageStatus === 3) {
          this.pageControl.pageStatus = 1;
        } else if (this.pageControl.pageStatus === 2) {
          this.$router.goBack();
        }
      },

      /**
       * 绑定
       */
      bind() {
        let _this = this;
        if (_this.phone.trim().length < 1) {
          _this.showToast("请输入手机号");
          return;
        }
        if (_this.smsCode.trim().length < 1) {
          _this.showToast("请输入短信验证码");
          return;
        }
        this.getUnionid().then(resp => {
          if (resp.isBind) {
            _this.showToast("已绑定");
            _this.pageControl.pageStatus = 2;
          } else {
            // 5、绑定
            let bindParams = {
              mobile: _this.phone,
              smsCode: _this.smsCode,
              unionid: resp.unionid
            };
            _this.$api.post(BIND_UNIONID_URL, bindParams).then((bindBackInfo) => {
              if (bindBackInfo.isSuccess) {
                _this.showToast("绑定成功");
                _this.pageControl.pageStatus = 2;
              } else {
                _this.showToast(bindBackInfo.message);
                _this.pageControl.pageStatus = 3;
                console.log("绑定失败！" + bindBackInfo.message);
              }
            });
          }
        }).catch(err => {
          _this.showToast("绑定失败");
          _this.pageControl.pageStatus = 3;
          console.log("绑定失败！" + err);
        });


        // // 1、获取微信授权
        // if (e.mp.detail.userInfo) {
        //   wx.getUserInfo({
        //     success(userInfoRes) {
        //       console.log(JSON.stringify(userInfoRes));
        //       _this.encryptedData = userInfoRes.encryptedData;
        //       _this.iv = userInfoRes.iv;
        //       if (_this.phone.trim().length < 1) {
        //         _this.showToast("请输入手机号");
        //         return;
        //       }
        //       if (_this.smsCode.trim().length < 1) {
        //         _this.showToast("请输入短信验证码");
        //         return;
        //       }
        //       // 2、调用 login接口拿到code
        //       _this.login().then((loginRes) => {
        //         if (loginRes.code) {
        //           // 3、获取openId
        //           _this.$api.post(GET_UNIONID_URL, { code: loginRes.code }).then((backInfo) => {
        //             if (backInfo.isSuccess) {
        //
        //               if (backInfo.response.unionid) {
        //                 _this.showToast("绑定成功");
        //                 _this.pageControl.pageStatus = 2;
        //                 return;
        //               }
        //               let decryptParam = {
        //                 encryptedData: _this.encryptedData,
        //                 iv: _this.iv,
        //                 openid: backInfo.response.openid
        //               };
        //               // 4、解密
        //               _this.$api.post(DECRYPT_URL, decryptParam).then((decryptBackInfo) => {
        //                 if (decryptBackInfo.isSuccess) {
        //                   let bindParams = {
        //                     mobile: _this.phone,
        //                     smsCode: _this.smsCode,
        //                     unionid: decryptBackInfo.response.unionId
        //                   };
        //                   if (decryptBackInfo.response.hasOwnProperty("isBindUnionid") && decryptBackInfo.response.isBindUnionid) {
        //                     // 已绑定，显示绑定失败
        //                     _this.showToast("已绑定");
        //                     _this.pageControl.pageStatus = 2;
        //                   } else {
        //                     // 5、绑定
        //                     _this.$api.post(BIND_UNIONID_URL, bindParams).then((bindBackInfo) => {
        //                       if (bindBackInfo.isSuccess) {
        //                         _this.showToast("绑定成功");
        //                         _this.pageControl.pageStatus = 2;
        //                       } else {
        //                         _this.showToast(bindBackInfo.message);
        //                         _this.pageControl.pageStatus = 3;
        //                         console.log("绑定失败！" + bindBackInfo.message);
        //                       }
        //                     });
        //                   }
        //                 } else {
        //                   _this.showToast(decryptBackInfo.message);
        //                 }
        //               });
        //             }
        //           });
        //         } else {
        //           _this.showToast("绑定失败");
        //           _this.pageControl.pageStatus = 3;
        //           console.log("登录失败！" + loginRes.errMsg);
        //         }
        //       });
        //     }
        //   });
        // } else {
        //   this.showToast("需要微信授权授权以后才能快捷登录");
        // }
        // 1、获取微信授权
        // this.getSetting().then((res) => {
        //   if (res.authSetting["scope.userInfo"]) {
        //
        //   }
        // });
      },
      /**
       * 暂不绑定
       */
      cancelBind() {
        this.$router.goBack();
      }
    }
  };
</script>

<style lang="less" scoped>
  //@formatter:off
  @default-icon-size: 36rpx;
  .bind-wx-container {
    width: 100vw;
    height: 100vh;
    background: #FFFFFF;

    .top-pic {
      width: 100%;
      height: 300rpx;
      background: url("$STATIC_URL/bg_bind_wx_top.png") no-repeat;
      background-size: contain;
    }

    .input-common-li {
      width: 90%;
      height: 96rpx;
      margin: 0 auto;
      margin-bottom: 32rpx;
      border: #E6E6E6 1rpx solid;
      border-radius: 50rpx;
      background: #F9F9F9 url("$STATIC_URL/ic_phone.png") no-repeat 48rpx center;
      background-size: @default-icon-size @default-icon-size;

      &.phone-li {
        margin-top: 45rpx;
      }

      &.sms-code-li {
        background: #F9F9F9 url("$STATIC_URL/ic_phone_sms_code.png") no-repeat 48rpx center;
        background-size: @default-icon-size 25rpx;
        position: relative;

        .send-sms-code {
          width: 150rpx;
          height: 96rpx;
          line-height: 96rpx;
          position: absolute;
          top: 0;
          right: 40rpx;
          font-size: 28rpx;
          color: #4C83F0;
          text-align: center;
        }
      }

      .common-input {
        height: 96rpx;
        line-height: 96rpx;
        font-size: 28rpx;
        color: #333333;
        margin-left: 96rpx;

        &.sms-code {
          width: 390rpx;
        }
      }
    }

    .submit-div {
      width: 95%;
      height: 140rpx;
      line-height: 140rpx;
      text-align: center;
      color: #333333;
      font-size: 28rpx;
      margin: 0 auto;
      margin-top: 12rpx;
      background: url('$STATIC_URL/bg_common_submit_btn.png') no-repeat;
      background-size: 100% 100%;
    }
    .submit-div::after{
      border: none;
    }

    .cancel-div {
      width: 95%;
      height: 140rpx;
      line-height: 140rpx;
      text-align: center;
      color: #333333;
      margin: 0 auto;
      font-size: 28rpx;
      margin-top: -16rpx;
      background: url('$STATIC_URL/bg_common_cancel_btn.png') no-repeat;
      background-size: 100% 100%;
    }

    .status-ul {

      .status-icon {
        width: 95%;
        margin: 0 auto;
        text-align: center;

        .icon {
          width: 130rpx;
          height: 130rpx;
          margin-top: 50rpx;
        }

        .status-message {
          font-size: 24rpx;
          color: #333333;
        }

        .status-hint {
          margin: 0 auto;
          width: 88%;
          margin-top: 40rpx;
          font-size: 21rpx;
          color: #878787;

        }
      }
    }

  }
</style>
