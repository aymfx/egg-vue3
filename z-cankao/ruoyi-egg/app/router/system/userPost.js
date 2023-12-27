module.exports = (app, basicUrl) => {
  //用户与岗位关联表查询
  app.router.get(
    basicUrl + "/system/userPost/list",
    app.controller.system.sysUserPost.list
  );

  //用户与岗位关联表详情
  app.router.get(
    basicUrl + "/system/userPost/:userId",
    app.controller.system.sysUserPost.detail
  );

  //用户与岗位关联表新增
  app.router.post(
    basicUrl + "/system/userPost",
    app.controller.system.sysUserPost.create
  );

  //用户与岗位关联表删除
  app.router.delete(
    basicUrl + "/system/userPost/:userId",
    app.controller.system.sysUserPost.delete
  );

  //用户与岗位关联表修改
  app.router.put(
    basicUrl + "/system/userPost",
    app.controller.system.sysUserPost.update
  );
};
