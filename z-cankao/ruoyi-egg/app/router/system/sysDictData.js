/*
 * @Author: mark
 * @Date: 2023-08-29 07:04:57
 * @LastEditors: mark
 * @LastEditTime: 2023-08-29 07:05:52
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/router/system/sysDictData.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //字典数据表查询
  app.router.get(
    basicUrl + "/system/dict/data/list",
    app.controller.system.sysDictData.list
  );

  //字典数据表详情
  app.router.get(
    basicUrl + "/system/dict/data/:dictCode",
    app.controller.system.sysDictData.detail
  );

  //字典数据表新增
  app.router.post(
    basicUrl + "/system/dict/data",
    app.controller.system.sysDictData.create
  );

  //字典数据表删除
  app.router.delete(
    basicUrl + "/system/dict/data/:dictCode",
    app.controller.system.sysDictData.delete
  );

  //字典数据表修改
  app.router.put(
    basicUrl + "/system/dict/data",
    app.controller.system.sysDictData.update
  );

  //字典数据表导出
  app.router.post(
    basicUrl + "/system/dict/data/export",
    app.controller.system.sysDictData.downLoad
  );
};
