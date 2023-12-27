/*
 * @Author: mark
 * @Date: 2023-06-24 21:13:07
 * @LastEditors: mark
 * @LastEditTime: 2023-09-28 14:04:30
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/router.js
 * @Description: 进行路由模块化，以适配若依的restFul风格
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
const { fileDisplay } = require("./utils/public");

module.exports = (app) => {
  // 标记是否有请求正在处理——代码生成模块
  app.isProcessingCodeCreate = false;
  // 存储等待处理的请求——代码生成模块
  app.requestQueueCodeCreate = [];
  let data = fileDisplay("./app/router");
  const basicUrl = "";
  data.forEach((item) => {
    item = item.replace(/\\/g, "/");
    require(item.split("app/").join("./").split(".js").join(""))(app, basicUrl);
  });
};
