/*
 * @Author: mark
 * @Date: 2023-08-14 02:29:22
 * @LastEditors: mark
 * @LastEditTime: 2023-08-14 10:40:06
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/router/system/roleDept.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //角色和部门关联表查询
  app.router.get(
    basicUrl + "/system/roleDept/list",
    app.controller.system.sysRoleDept.list
  );

  //角色和部门关联表详情
  app.router.get(
    basicUrl + "/system/roleDept/:roleId",
    app.controller.system.sysRoleDept.detail
  );

  //角色和部门关联表新增
  app.router.post(
    basicUrl + "/system/roleDept",
    app.controller.system.sysRoleDept.create
  );

  //角色和部门关联表删除
  app.router.delete(
    basicUrl + "/system/roleDept/:roleId",
    app.controller.system.sysRoleDept.delete
  );

  //角色和部门关联表修改
  app.router.put(
    basicUrl + "/system/roleDept",
    app.controller.system.sysRoleDept.update
  );
};
