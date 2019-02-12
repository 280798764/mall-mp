/**
 * mixins
 */
const TOAST_DURATION = 1500;
const TOAST_ICON_SUCCESS = "success";
const TOAST_ICON_ERROR = "error";
const TOAST_ICON_NONE = "none";
export default {
  data() {
    return {};
  },
  methods: {
    showToast(title) {
      this.baseToast(title, TOAST_ICON_NONE);
    },
    showSuccessToast(title) {
      this.baseToast(title, TOAST_ICON_SUCCESS);
    },
    showErrorToast(title) {
      this.baseToast(title, TOAST_ICON_ERROR);
    },
    baseToast(title, icon) {
      wx.showToast({
        title: title,
        icon: icon,
        duration: TOAST_DURATION,
        mask: true
      });
    },
    showModal() {
      wx.showModal({
        title: "提示",
        content: "这是一个模态弹窗",
        success: function(res) {
          if (res.confirm) {//这里是点击了确定以后
            console.log("用户点击确定");
          } else {//这里是点击了取消以后
            console.log("用户点击取消");
          }
        }
      });
    },
    showActionSheet(list) {
      return new Promise((resolve, reject) => {
        wx.showActionSheet({
          itemList: list,
          success(res) {
            resolve(res);
          },
          fail(res) {
            reject(res);
          }
        });
      });
    },
    login() {
      return new Promise((resolve, reject) => {
        wx.login({
          success(res) {
            resolve(res);
          }, fail(res) {
            reject(res);
          }
        });
      });
    },
    getSetting() {
      return new Promise((resolve, reject) => {
        wx.getSetting({
          success(res) {
            resolve(res);
          }, fail(err) {
            reject(err);
          }
        });
      });
    },
    getUserInfo() {
      return new Promise((resolve, reject) => {
        wx.getUserInfo({
          success(res) {
            resolve(res);
          }, fail(err) {
            reject(err);
          }
        });
      });
    }
  }
};
