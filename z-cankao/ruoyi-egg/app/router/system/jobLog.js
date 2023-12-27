/*
 * @Author: mark
 * @Date: 2023-08-14 02:27:16
 * @LastEditors: mark
 * @LastEditTime: 2023-08-14 10:39:20
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/router/system/jobLog.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //定时任务调度日志表查询
  app.router.get(
    basicUrl + "/system/jobLog/list",
    app.controller.system.sysJobLog.list
  );

  //定时任务调度日志表详情
  app.router.get(
    basicUrl + "/system/jobLog/:jobLogId",
    app.controller.system.sysJobLog.detail
  );

  //定时任务调度日志表新增
  app.router.post(
    basicUrl + "/system/jobLog",
    app.controller.system.sysJobLog.create
  );

  //定时任务调度日志表删除
  app.router.delete(
    basicUrl + "/system/jobLog/:jobLogId",
    app.controller.system.sysJobLog.delete
  );

  //定时任务调度日志表修改
  app.router.put(
    basicUrl + "/system/jobLog",
    app.controller.system.sysJobLog.update
  );
};
