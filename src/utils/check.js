export default {
  checkLength (msg) { // 返回字段的长度
    let lengthReg = msg.length
    return lengthReg
  },
  checkEmail (msg) { // 校验email电子邮箱
    const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (regEmail.test(msg)) {
      return true
    } else {
      return false
    }
  },
  checkPhone (msg) { // 校验手机号码
    const regPhone = /(^13\d{9}$)|(^14)[5,7,9]\d{8}$|(^15[0,1,2,3,5,6,7,8,9]\d{8}$)|(^17)[0,1,3,5,6,7,8]\d{8}$|(^18\d{9}$)|(^316\d{8}$)/
    if (regPhone.test(msg)) {
      return true
    } else {
      return false
    }
  },
  checkChiness (msg) { // 校验中文(不校验长度)
    const regChiness = /^[\u4e00-\u9fa5]+$/
    if (regChiness.test(msg)) {
      return true
    } else {
      return false
    }
  },
  checkID (msg) { // 校验身份证号码
    const regID = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
    if (regID.test(msg)) {
      return true
    } else {
      return false
    }
  },
  checkTel (msg) { // 校验座机号码
    const regTel = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/
    if (regTel.test(msg)) {
      return true
    } else {
      return false
    }
  },
  checkReceipt (msg) { // 校验税号
    const regReceipt = /^[0-9a-zA-Z]{15}$|^[0-9a-zA-Z]{18}$/
    if (regReceipt.test(msg)) {
      return true
    } else {
      return false
    }
  },
  checkBankCardNum (msg) { // 校验银行卡号
    const regBankCardNum = /^[0-9]{5,23}$/
    if (regBankCardNum.test(msg)) {
      return true
    } else {
      return false
    }
  },
  checkPwd (msg) { // 校验登录密码
    const regPwd = /^[0-9a-zA-Z]{6,20}$/
    if (regPwd.test(msg)) {
      return true
    } else {
      return false
    }
  },
  checkMobileOrTel (msg) { // 校验联系方式固话或者手机号
    const regPwd = /((^13\d{9}$)|(^316\d{8}$)|(^14)[5,7,9]\d{8}$|(^15[0,1,2,3,5,6,7,8,9]\d{8}$)|(^17)[0,1,3,5,6,7,8]\d{8}$|(^18\d{9}$))|((^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{11,12}))$))/
    if (regPwd.test(msg)) {
      return true
    } else {
      return false
    }
  }
}
