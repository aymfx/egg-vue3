/*
 * @Author: mark
 * @Date: 2023-06-24 21:42:15
 * @LastEditors: mark
 * @LastEditTime: 2023-07-01 17:34:46
 * @FilePath: /自研/RuoYI-egg/ruoyi-egg/app/router/system/log.js
 * @Description:主要的系统接口路径，如登录等
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //获取文件中的日志
  app.router.get(basicUrl + "/log", app.controller.system.log.index);
};
