module.exports = (app, basicUrl) => {
  //导入数据库
  app.router.post(
    basicUrl + "/tool/gen/importTable",
    app.controller.tool.gen.importTable
  );
};
