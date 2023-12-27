/*
 * @Author: mark
 * @Date: 2023-07-31 22:02:03
 * @LastEditors: mark
 * @LastEditTime: 2023-08-29 07:07:04
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/utils/codeTemplate/router.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const fs = require("fs");
const path = require("path");

function buildRouter(config) {
  // 生成 Router 文件
  const routerFile = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "autoModule",
    "service",
    "app",
    "router",
    config.module,
    `${config.moduleName}.js`
  );
  let treeAdd = "";
  //判断是否需要生成树查询接口
  let type = config.newData[0].tpl_category;
  if (type == "tree") {
    treeAdd = `
    //${config.newData[0].table_comment}树查询
    app.router.get(
        basicUrl + "/${config.module}/${config.moduleName}/tree",
        app.controller.${config.module}.${config.moduleName}.tree
    );
    `;
  }
  if (!fs.existsSync(routerFile)) {
    const routerCode = `
module.exports = (app, basicUrl) => {
    //${config.newData[0].table_comment}查询
    app.router.get(
        basicUrl + "/${config.module}/${config.moduleName}/list",
        app.controller.${config.module}.${config.moduleName}.list
    );

    //${config.newData[0].table_comment}详情
    app.router.get(
        basicUrl + "/${config.module}/${config.moduleName}/:${config.primaryKeyHub}",
        app.controller.${config.module}.${config.moduleName}.detail
    );

    //${config.newData[0].table_comment}新增
    app.router.post(
        basicUrl + "/${config.module}/${config.moduleName}",
        app.controller.${config.module}.${config.moduleName}.create
    );

    //${config.newData[0].table_comment}删除
    app.router.delete(
        basicUrl + "/${config.module}/${config.moduleName}/:${config.primaryKeyHub}",
        app.controller.${config.module}.${config.moduleName}.delete
    );

    //${config.newData[0].table_comment}修改
    app.router.put(
        basicUrl + "/${config.module}/${config.moduleName}",
        app.controller.${config.module}.${config.moduleName}.update
    );

    //${config.newData[0].table_comment}导出
    app.router.post(
        basicUrl + "/${config.module}/${config.moduleName}/export",
        app.controller.${config.module}.${config.moduleName}.downLoad
    );

    ${treeAdd}
};      
    `;
    fs.writeFileSync(routerFile, routerCode);
  }

  console.log(`生成 ${config.moduleName} 模块的路由文件成功！`);
}

module.exports = {
  buildRouter,
};
