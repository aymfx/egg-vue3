/*
 * @Author: mark
 * @Date: 2023-08-14 09:10:56
 * @LastEditors: mark
 * @LastEditTime: 2023-08-25 06:59:51
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/router/monitor/sysLogininfor.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

module.exports = (app, basicUrl) => {
  //系统访问记录查询
  app.router.get(
    basicUrl + "/monitor/logininfor/list",
    app.controller.system.sysLogininfor.list
  );

  //系统访问记录详情
  app.router.get(
    basicUrl + "/monitor/logininfor/:infoId",
    app.controller.system.sysLogininfor.detail
  );

  //系统访问记录新增
  app.router.post(
    basicUrl + "/monitor/logininfor",
    app.controller.system.sysLogininfor.create
  );
  //操作日志记录导出
  app.router.post(
    basicUrl + "/monitor/logininfor/export",
    app.controller.system.sysLogininfor.downLoad
  );
  //系统访问记录删除
  app.router.delete(
    basicUrl + "/monitor/logininfor/:infoId",
    app.controller.system.sysLogininfor.delete
  );

  //系统访问记录修改
  app.router.put(
    basicUrl + "/monitor/logininfor",
    app.controller.system.sysLogininfor.update
  );
};
