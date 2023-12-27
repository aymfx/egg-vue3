module.exports = (app, basicUrl) => {
  //角色和菜单关联表查询
  app.router.get(
    basicUrl + "/system/roleMenu/list",
    app.controller.system.sysRoleMenu.list
  );

  //角色和菜单关联表详情
  app.router.get(
    basicUrl + "/system/roleMenu/:roleId",
    app.controller.system.sysRoleMenu.detail
  );

  //角色和菜单关联表新增
  app.router.post(
    basicUrl + "/system/roleMenu",
    app.controller.system.sysRoleMenu.create
  );

  //角色和菜单关联表删除
  app.router.delete(
    basicUrl + "/system/roleMenu/:roleId",
    app.controller.system.sysRoleMenu.delete
  );

  //角色和菜单关联表修改
  app.router.put(
    basicUrl + "/system/roleMenu",
    app.controller.system.sysRoleMenu.update
  );
};
