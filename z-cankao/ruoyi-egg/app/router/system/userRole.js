/*
 * @Author: mark
 * @Date: 2023-08-14 02:31:34
 * @LastEditors: mark
 * @LastEditTime: 2023-08-14 10:41:04
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/router/system/userRole.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //用户和角色关联表查询
  app.router.get(
    basicUrl + "/system/userRole/list",
    app.controller.system.sysUserRole.list
  );

  //用户和角色关联表详情
  app.router.get(
    basicUrl + "/system/userRole/:userId",
    app.controller.system.sysUserRole.detail
  );

  //用户和角色关联表新增
  app.router.post(
    basicUrl + "/system/userRole",
    app.controller.system.sysUserRole.create
  );

  //用户和角色关联表删除
  app.router.delete(
    basicUrl + "/system/userRole/:userId",
    app.controller.system.sysUserRole.delete
  );

  //用户和角色关联表修改
  app.router.put(
    basicUrl + "/system/userRole",
    app.controller.system.sysUserRole.update
  );
};
