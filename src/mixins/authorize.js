import { LOGIN_BY_UNIONID_URL, GET_UNIONID_URL, DECRYPT_URL } from "../api/ApiCgi";

export default {


  methods: {

    getUnionid() {
      return new Promise((resole, reject) => {
        var resp = {};
        resp.isBind = false;
        this.login().then((loginRes) => {
          if (loginRes.code) {
            // 后台接口获取opein 或者 unionid
            this.$api.post(GET_UNIONID_URL, { code: loginRes.code }, false).then((backInfo) => {
              if (backInfo.isSuccess) {
                if (backInfo.response.unionid) {
                  resp.unionid = backInfo.response.unionid;
                  resp.isBind = true;
                  resole(resp);
                } else {
                  this.getUserInfo().then((userInfoRes) => {
                    let encryptParams = {
                      encryptedData: userInfoRes.encryptedData,
                      iv: userInfoRes.iv,
                      openid: backInfo.response.openid
                    };
                    // 解密
                    this.$api.post(DECRYPT_URL, encryptParams, false).then((encryptBackInfo) => {
                      if (encryptBackInfo.isSuccess) {
                        //登录
                        resp.unionid = encryptBackInfo.response.unionId;
                        resp.isBind = encryptBackInfo.response.isBindUnionid;
                        resole(resp);
                      } else {
                        reject(encryptBackInfo);
                      }
                    });
                  }).catch(userInfoResErr => {
                    reject(userInfoResErr);
                  });
                }
              } else {
                reject(backInfo);
              }
            });
          }
        });
      });
    },

    loginByUnionId(unionid) {
      this.$api.post(LOGIN_BY_UNIONID_URL, { unionid: unionid }).then(res => {
        if (res.isSuccess) {
          this.userInfo.token = res.response.data.token;
          this.userInfo.mobile = res.response.data.memberInfo.mobile;
          this.userInfo.unionid = res.response.data.memberInfo.unionid;
          this.userInfo.memberCode = res.response.data.memberInfo.memberCode;
          this.userInfo.memberName = res.response.data.memberInfo.memberName;
          wx.setStorageSync("userInfo", this.userInfo);
          this.$router.redirectTo("/pages/boxLists/main");
        } else {
          this.showToast(res.message);
        }
      });
    }
  }
};
