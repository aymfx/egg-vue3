/*
 * @Author: mark
 * @Date: 2023-08-14 09:10:52
 * @LastEditors: mark
 * @LastEditTime: 2023-08-24 06:57:36
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/router/system/sysOperLog.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //操作日志记录查询
  app.router.get(
    basicUrl + "/monitor/operlog/list",
    app.controller.system.sysOperLog.list
  );

  //操作日志记录查询
  app.router.get(
    basicUrl + "/monitor/operlog/list",
    app.controller.system.sysOperLog.list
  );

  //操作日志记录详情
  app.router.get(
    basicUrl + "/monitor/operlog/:operId",
    app.controller.system.sysOperLog.detail
  );

  //操作日志记录新增
  app.router.post(
    basicUrl + "/monitor/operlog",
    app.controller.system.sysOperLog.create
  );

  //操作日志记录导出
  app.router.post(
    basicUrl + "/monitor/operlog/export",
    app.controller.system.sysOperLog.downLoad
  );

  //操作日志记录删除
  app.router.delete(
    basicUrl + "/monitor/operlog/:operId",
    app.controller.system.sysOperLog.delete
  );

  //操作日志记录修改
  app.router.put(
    basicUrl + "/monitor/operlog",
    app.controller.system.sysOperLog.update
  );
};
