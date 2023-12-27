/*
 * @Author: mark
 * @Date: 2023-07-02 21:43:35
 * @LastEditors: mark
 * @LastEditTime: 2023-07-02 22:33:25
 * @FilePath: /自研/RuoYI-egg/ruoyi-egg/app/router/tool/gen/db.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //同步表结构
  app.router.get(
    basicUrl + "/tool/gen/synchDb/:tableName",
    app.controller.tool.gen.synchDb
  );
};
