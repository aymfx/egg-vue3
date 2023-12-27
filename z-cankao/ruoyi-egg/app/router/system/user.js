/*
 * @Author: mark
 * @Date: 2023-08-14 02:30:04
 * @LastEditors: mark
 * @LastEditTime: 2023-09-03 18:30:20
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/router/system/user.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //用户信息表查询
  app.router.get(
    basicUrl + "/system/user/list",
    app.controller.system.sysUser.list
  );

  //用户信息表详情
  app.router.get(
    basicUrl + "/system/user/:userId",
    app.controller.system.sysUser.detail
  );

  //用户信息表详情
  app.router.get(
    basicUrl + "/system/user/",
    app.controller.system.sysUser.detail
  );

  //获取用户角色信息
  app.router.get(
    basicUrl + "/system/user/authRole/:userId",
    app.controller.system.sysUser.getAuthRole
  );

  //修改用户角色信息
  app.router.put(
    basicUrl + "/system/user/authRole",
    app.controller.system.sysUser.updateAuthRole
  );

  //用户信息表新增
  app.router.post(
    basicUrl + "/system/user",
    app.controller.system.sysUser.create
  );

  //用户信息表删除
  app.router.delete(
    basicUrl + "/system/user/:userId",
    app.controller.system.sysUser.delete
  );

  //用户信息表修改
  app.router.put(
    basicUrl + "/system/user",
    app.controller.system.sysUser.update
  );

  //用户重置密码
  app.router.put(
    basicUrl + "/system/user/resetPwd",
    app.controller.system.sysUser.resetPwd
  );

  //用户信息下载
  app.router.post(
    basicUrl + "/system/user/export",
    app.controller.system.sysUser.downLoad
  );
};
