/*
 * @Author: mark
 * @Date: 2023-08-29 06:56:16
 * @LastEditors: mark
 * @LastEditTime: 2023-08-30 07:15:14
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/router/system/sysDictType.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //字典类型表查询
  app.router.get(
    basicUrl + "/system/dict/type/list",
    app.controller.system.sysDictType.list
  );

  //字典类型表详情
  app.router.get(
    basicUrl + "/system/dict/type/:dictId",
    app.controller.system.sysDictType.detail
  );

  //字典类型表新增
  app.router.post(
    basicUrl + "/system/dict/type",
    app.controller.system.sysDictType.create
  );

  //字典类型表删除
  app.router.delete(
    basicUrl + "/system/dict/type/:dictId",
    app.controller.system.sysDictType.delete
  );

  //字典类型表修改
  app.router.put(
    basicUrl + "/system/dict/type",
    app.controller.system.sysDictType.update
  );

  //字典类型表导出
  app.router.post(
    basicUrl + "/system/dict/type/export",
    app.controller.system.sysDictType.downLoad
  );

  //根据某个字典类型查询具体信息
  app.router.get(
    basicUrl + "/system/dict/data/type/:dictType",
    app.controller.system.sysDictType.getValue
  );
};
