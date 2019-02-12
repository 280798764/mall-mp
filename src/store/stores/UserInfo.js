/**
 *用户登录后基础信息存储
 */
export default {
  namespaced: true,
  state: {
    memberCode: "",
    loginAccount: "",
    mobile: "",
    memberName: "",
    token: ""
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.memberCode = userInfo.memberCode;
      state.loginAccount = userInfo.loginAccount;
      state.mobile = userInfo.mobile;
      state.memberName = userInfo.memberName;
      state.token = userInfo.token;
    },
    clearUserInfo(state) {
      state.memberCode = "";
      state.loginAccount = "";
      state.mobile = "";
      state.memberName = "";
      state.token = "";
    }
  }
};
