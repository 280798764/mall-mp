/**
 *小程序环境配置
 */
export default {
  namespaced: true,
  state: {
    mobile: "",
    token: ""
  },
  mutations: {
    setUserInfo(state,userInfo) {
      state.mobile = userInfo.phone;
      state.token = userInfo.iToken;
    }
  }
};
