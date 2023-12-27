/*
 * @Author: mark
 * @Date: 2023-06-25 07:07:09
 * @LastEditors: mark
 * @LastEditTime: 2023-09-03 18:16:05
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/common/serverResponse.js
 * @Description: 用于统一构建需要返回的返回体
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const { SUCCESS, ERROR, BUSINESS_CODE } = require("./responseCode");

module.exports = class ServerResponse {
  constructor(code, msg, data, Objdata) {
    this.code = code;
    this.msg = msg;
    this.data = data;
    if (Objdata) {
      Object.assign(this, Objdata);
      if (!Objdata.data) {
        delete this.data;
      }
    }
  }

  isSuccess() {
    return this.code === SUCCESS;
  }

  getcode() {
    return this.code;
  }

  getData() {
    return this.data;
  }

  getMsg() {
    return this.msg;
  }

  static createBySuccess() {
    return new ServerResponse(SUCCESS);
  }

  static createBySuccessMsg(msg) {
    return new ServerResponse(SUCCESS, msg, null);
  }

  static createBySuccessData(data) {
    return new ServerResponse(SUCCESS, "操作成功", data);
  }

  static createBySuccessMsgAndData(msg, data, Objdata) {
    return new ServerResponse(SUCCESS, msg, data, Objdata);
  }

  static createByError() {
    return new ServerResponse(ERROR, "error", null);
  }

  static createByErrorMsg(errorMsg) {
    return new ServerResponse(ERROR, errorMsg, null);
  }

  static createByErrorCodeMsg(errorCode, errorMsg) {
    return new ServerResponse(errorCode, errorMsg, null);
  }

  static createByErrorCodeMsgBusiness(errCode) {
    return new ServerResponse(errCode, BUSINESS_CODE[errCode], null);
  }
};
