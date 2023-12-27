/*
 * @Author: mark
 * @Date: 2023-08-14 03:00:08
 * @LastEditors: mark
 * @LastEditTime: 2023-08-31 06:54:15
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/router/system/dept.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //部门表查询
  app.router.get(
    basicUrl + "/system/dept/list",
    app.controller.system.sysDept.list
  );

  //部门表详情
  app.router.get(
    basicUrl + "/system/dept/:deptId",
    app.controller.system.sysDept.detail
  );

  //部门表新增
  app.router.post(
    basicUrl + "/system/dept",
    app.controller.system.sysDept.create
  );

  //部门表删除
  app.router.delete(
    basicUrl + "/system/dept/:deptId",
    app.controller.system.sysDept.delete
  );

  //部门表修改
  app.router.put(
    basicUrl + "/system/dept",
    app.controller.system.sysDept.update
  );

  //部门表树查询
  app.router.get(
    basicUrl + "/system/dept/tree",
    app.controller.system.sysDept.tree
  );

  //部门模块，查询所在部门链路排除自身和自身下级部门
  app.router.get(
    basicUrl + "/system/dept/list/exclude/:deptId",
    app.controller.system.sysDept.excludeSelect
  );
};
