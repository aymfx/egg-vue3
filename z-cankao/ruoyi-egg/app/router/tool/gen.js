/*
 * @Author: mark
 * @Date: 2023-07-02 21:43:35
 * @LastEditors: mark
 * @LastEditTime: 2023-08-24 06:57:02
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/router/tool/gen.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //查询代码生成的数据
  app.router.get(basicUrl + "/tool/gen/list", app.controller.tool.gen.list);
  //查询某个表的详细数据
  app.router.get(
    basicUrl + "/tool/gen/:tableId",
    app.controller.tool.gen.findOne
  );
  //删除
  app.router.delete(
    basicUrl + "/tool/gen/:tableId",
    app.controller.tool.gen.deleteTable
  );
  //修改
  app.router.put(basicUrl + "/tool/gen", app.controller.tool.gen.update);
};
