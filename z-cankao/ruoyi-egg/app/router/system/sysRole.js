/*
 * @Author: mark
 * @Date: 2023-08-31 07:23:05
 * @LastEditors: mark
 * @LastEditTime: 2023-09-01 07:21:22
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/router/system/sysRole.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //角色信息表查询
  app.router.get(
    basicUrl + "/system/role/list",
    app.controller.system.sysRole.list
  );

  //角色信息表详情
  app.router.get(
    basicUrl + "/system/role/:roleId",
    app.controller.system.sysRole.detail
  );

  //角色信息表新增
  app.router.post(
    basicUrl + "/system/role",
    app.controller.system.sysRole.create
  );

  //角色信息表删除
  app.router.delete(
    basicUrl + "/system/role/:roleId",
    app.controller.system.sysRole.delete
  );

  //角色信息表修改
  app.router.put(
    basicUrl + "/system/role",
    app.controller.system.sysRole.update
  );

  //修改数据授权
  app.router.put(
    basicUrl + "/system/role/:id",
    app.controller.system.sysRole.changeData
  );

  //分配用户数据查询
  app.router.get(
    basicUrl + `/system/role/authUser/:type`,
    app.controller.system.sysRole.allocatedList
  );

  //批量授权用户角色或取消授权角色
  app.router.put(
    basicUrl + `/system/role/authUser/:type`,
    app.controller.system.sysRole.selectAll
  );

  //角色信息表导出
  app.router.post(
    basicUrl + "/system/role/export",
    app.controller.system.sysRole.downLoad
  );

  //获取角色下的权限
  app.router.get(
    basicUrl + "/system/role/deptTree/:roleId",
    app.controller.system.sysRole.getIdRole
  );
};
