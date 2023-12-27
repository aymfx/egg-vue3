/*
 * @Author: mark
 * @Date: 2023-06-24 21:42:15
 * @LastEditors: mark
 * @LastEditTime: 2023-07-02 17:52:27
 * @FilePath: /自研/RuoYI-egg/ruoyi-egg/app/router/system/sysBasic.js
 * @Description:主要的系统接口路径，如登录等
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //获取验证码
  app.router.get(
    basicUrl + "/captchaImage",
    app.controller.system.sysBasic.captchaImage
  );
  //登录
  app.router.post(basicUrl + "/login", app.controller.system.sysBasic.login);
  //获取登录信息
  app.router.get(basicUrl + "/getInfo", app.controller.system.sysBasic.getInfo);
  //获取路由信息
  app.router.get(
    basicUrl + "/getRouters",
    app.controller.system.sysBasic.getRouters
  );
};
