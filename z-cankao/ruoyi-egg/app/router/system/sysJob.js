module.exports = (app, basicUrl) => {
  //定时任务调度表查询
  app.router.get(
    basicUrl + "/monitor/job/list",
    app.controller.system.sysJob.list
  );

  //定时任务调度表详情
  app.router.get(
    basicUrl + "/monitor/job/:jobId",
    app.controller.system.sysJob.detail
  );

  //定时任务调度表新增
  app.router.post(
    basicUrl + "/monitor/job",
    app.controller.system.sysJob.create
  );

  //定时任务调度表删除
  app.router.delete(
    basicUrl + "/monitor/job/:jobId",
    app.controller.system.sysJob.delete
  );

  //定时任务调度表修改
  app.router.put(
    basicUrl + "/monitor/job",
    app.controller.system.sysJob.update
  );
};
