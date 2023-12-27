module.exports = (app, basicUrl) => {
  //岗位信息表查询
  app.router.get(
    basicUrl + "/system/post/list",
    app.controller.system.sysPost.list
  );

  //岗位信息表详情
  app.router.get(
    basicUrl + "/system/post/:postId",
    app.controller.system.sysPost.detail
  );

  //岗位信息表新增
  app.router.post(
    basicUrl + "/system/sysPost",
    app.controller.system.sysPost.create
  );

  //岗位信息表删除
  app.router.delete(
    basicUrl + "/system/post/:postId",
    app.controller.system.sysPost.delete
  );

  //岗位信息表修改
  app.router.put(
    basicUrl + "/system/sysPost",
    app.controller.system.sysPost.update
  );

  //岗位信息表导出
  app.router.post(
    basicUrl + "/system/post/export",
    app.controller.system.sysPost.downLoad
  );
};
