import store from "../store/index";
import notNeedTokenList from "../api/DonotNeedTokenList";


class Request {

  defaultRequest(requestParam, isShowLoading, method) {
    this.showLoading(isShowLoading);
    let _this = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: "$REQUEST_URL/cgi/",
        header: {},
        dataType: "json",
        method: method,
        data: requestParam,
        success(res) {
          resolve(_this.handleSuccess(res));
        },
        fail(err) {
          reject(_this.handleFail(err));
        },
        complete() {
          _this.hideLoading(isShowLoading);
        }
      });
    });
  }

  /**
   * 处理接口错误
   * @param res
   */
  handleSuccess(res) {
    // todo
    // 1、处理 token 失效、请求无 token 的情况

    // 2、兼容无 error 字段的情况

    // 3、处理请求成功的返回

    let backInfo = {};
    if (JSON.stringify(res.data.auth) === {}
      || (res.data.auth !== {} && res.data.auth.tokenValid === false)
      || (res.data.error && res.data.error.errorCode === 14)) {

      this.goLogin();
    } else {
      if (res.data.error != null && res.data.error !== {}) {
        backInfo.isSuccess = false;
        backInfo.message = res.data.error.errorInfo;
        console.log(JSON.stringify(res.data.error.errorCode));
        if (res.data.error.errorCode === 15) {
          wx.clearStorageSync();
          wx.reLaunch({
              url: "../../pages/boxLists/main"
            }
          );
        } else {
          return backInfo;
        }
      } else {
        if (res.data.response !== null && res.data.response.hasOwnProperty("success")) {
          if (res.data.response.success) {
            backInfo.isSuccess = true;
            backInfo.content = res.data;
            backInfo.response = res.data.response;
            return backInfo;
          } else {
            backInfo.isSuccess = false;
            if (res.data.response.hasOwnProperty("errorMsg")){
              backInfo.message = res.data.response.errorMsg;
            }
            if (res.data.response.hasOwnProperty("reason")){
              backInfo.message = res.data.response.reason;
            }
            return backInfo;
          }
        } else {
          backInfo.isSuccess = true;
          backInfo.content = res.data;
          backInfo.response = res.data.response;
          return backInfo;
        }
      }
    }

  }

  /**
   * 处理请求错误
   * @param err
   */
  handleFail(err) {
    let backInfo = {};
    backInfo.isSuccess = false;
    backInfo.message = "服务器连接失败";
    console.info(JSON.stringify(err));
    return backInfo;
  }

  post(cmd, parameters, isShowLoading) {
    return this.defaultRequest(this.configParams(cmd, parameters), isShowLoading === undefined ? true : isShowLoading, "POST");
  }


  postList(cmd, parameters, pageInfo, isShowLoading) {
    return this.defaultRequest(this.configParams(cmd, parameters, pageInfo), isShowLoading === undefined ? true : isShowLoading, "POST");
  }

  configParams(cmd, parameters, pageInfo) {
    let requestParams = {};
    requestParams.cmd = cmd || "";
    requestParams.parameters = parameters || {};
    if (notNeedTokenList.indexOf(cmd) === -1) {
      requestParams.userToken = wx.getStorageSync("userInfo").token || "";
    }
    Object.assign(requestParams, pageInfo);
    // console.log(JSON.stringify("$REQUEST_URL/cgi/"));
    return requestParams;
  }

  goLogin() {
    wx.clearStorageSync();
    wx.reLaunch({
      url: "/pages/login/main"
    });
  }

  showLoading(isShowLoading) {
    if (isShowLoading) {
      wx.showLoading({ title: "加载中...", mask: true });
    }
  }

  hideLoading(isShowLoading) {
    if (isShowLoading) {
      wx.hideLoading();
    }
  }

  // 网络请求返回格式
  backInfos = {
    //请求是否成功
    isSuccess: false,
    //请求返回原始值
    content: "",
    //请求返回截取 response 里面的值
    response: "",
    //请求失败提示
    message: ""
  };
}

export default new Request();
