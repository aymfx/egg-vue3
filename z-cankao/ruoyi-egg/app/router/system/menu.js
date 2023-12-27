/*
 * @Author: mark
 * @Date: 2023-07-15 22:49:51
 * @LastEditors: mark
 * @LastEditTime: 2023-08-31 07:06:42
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/router/system/menu.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //获取菜单列表
  app.router.get(
    basicUrl + "/system/menu/list",
    app.controller.system.sysMenu.list
  );

  //菜单权限表详情
  app.router.get(
    basicUrl + "/system/menu/:menuId",
    app.controller.system.sysMenu.detail
  );

  //菜单权限表新增
  app.router.post(
    basicUrl + "/system/menu",
    app.controller.system.sysMenu.create
  );

  //菜单权限表删除
  app.router.delete(
    basicUrl + "/system/menu/:menuId",
    app.controller.system.sysMenu.delete
  );

  //菜单权限表修改
  app.router.put(
    basicUrl + "/system/menu",
    app.controller.system.sysMenu.update
  );

  //菜单权限表导出
  app.router.post(
    basicUrl + "/system/sysMenu/export",
    app.controller.system.sysMenu.downLoad
  );
};
