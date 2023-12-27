/*
 * @Author: mark
 * @Date: 2023-06-25 07:06:14
 * @LastEditors: mark
 * @LastEditTime: 2023-06-25 07:06:18
 * @FilePath: /自研/RuoYI-egg/ruoyi-egg/app/common/resCode.js
 * @Description: 用于统一定义返回的code
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = {
  //成功
  SUCCESS: 200,
  //失败
  ERROR: 1,
  //需要登录
  NEED_LOGIN: 10,
  //没有权限
  NO_AUTH: 20,
  //业务code
  BUSINESS_CODE: {
    10010: "添加失败",
    10011: "存在相同数据，请检查",
    10012: "删除数据不存在",
    10013: "该数据不存在，请刷新后重试",
    10014: "仅能删除一个数据，不支持同时删除多个数据",
    10015: "未完全创建，过程中出错，请刷新后检查参数",
    40001: "传入数据不符合规范",
    50001: "用户名或密码错误",
    60001: "验证码错误",
    70001: "有人正在执行该操作，请稍后重试",
    90001: "接口异常，请联系管理员",
  },
};
