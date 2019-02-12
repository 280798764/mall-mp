class WxRouter {
  /**
   * 使用微信提供的方式
   * @param path
   * @param params
   * @returns {Promise<any>}
   */
  init(path, params) {
    if (path === undefined || JSON.stringify(path).length < 1) {
      throw new Error("path is null");
    }
    let url = path;
    if (params !== undefined && JSON.stringify(params) !== "{}") {
      url += "?";
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          url = url + key + "=" + params[key] + "&";
        }
      }
      url = url.substring(0, url.length - 1);
    }
    return new Promise((resolve, reject) => {
      wx.navigateTo({
        url: url,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        }
      })
      ;
    });
  }

  /**
   * 封装页面跳转
   * @param path
   * @param param
   * @returns {*}
   */
  navigateTo(path, param) {
    return this.init(path, param);
  }

  goBack(delta){
    wx.navigateBack({
      delta: delta === undefined ? 1 : delta
    })
  }

  reLaunch(path){
    wx.reLaunch({
      url: path
    })
  }

  redirectTo(path){
    wx.redirectTo({
      url: path
    })
  }

}

export default new WxRouter();
