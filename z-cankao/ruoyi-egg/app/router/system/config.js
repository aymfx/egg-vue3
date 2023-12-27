/*
 * @Author: mark
 * @Date: 2023-08-13 09:03:34
 * @LastEditors: mark
 * @LastEditTime: 2023-08-28 06:48:16
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/router/system/config.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //参数配置表查询
  app.router.get(
    basicUrl + "/system/config/list",
    app.controller.system.sysConfig.list
  );

  //参数配置表详情
  app.router.get(
    basicUrl + "/system/config/:configId",
    app.controller.system.sysConfig.detail
  );

  //参数配置表获取配置参数字段
  app.router.get(
    basicUrl + "/system/config/configKey/:configKey",
    app.controller.system.sysConfig.getKey
  );

  //参数配置表新增
  app.router.post(
    basicUrl + "/system/config",
    app.controller.system.sysConfig.create
  );

  //参数配置表删除
  app.router.delete(
    basicUrl + "/system/config/:configId",
    app.controller.system.sysConfig.delete
  );

  //参数配置表修改
  app.router.put(
    basicUrl + "/system/config",
    app.controller.system.sysConfig.update
  );

  //参数配置导出
  app.router.post(
    basicUrl + "/system/config/export",
    app.controller.system.sysConfig.downLoad
  );

  //参数配置刷新缓存
  app.router.delete(
    basicUrl + "/system/config/refreshCache",
    app.controller.system.sysConfig.refreshCache
  );
};
