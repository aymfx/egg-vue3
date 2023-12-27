/*
 * @Author: mark
 * @Date: 2023-07-02 21:13:59
 * @LastEditors: mark
 * @LastEditTime: 2023-09-28 15:43:28
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/service/tool/genTable.js
 * @Description:代码生成模块
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const { generateFiles } = require("../../utils/genTable.js");
const Service = require("egg").Service;
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");
const tableCreateEvent = new EventEmitter();

/**
 *一个基于回调的函数
 * @param {*} eventEmitter
 * @param {*} eventName
 * @returns
 */
function listenEvent(eventEmitter, eventName) {
  return new Promise((resolve, reject) => {
    eventEmitter.on(eventName, (data) => {
      resolve(data);
    });
    eventEmitter.on("error", (error) => {
      reject(error);
    });
  });
}
class GenTableService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.GenTable = ctx.model.GenTable;
    this.GenTableColumn = ctx.model.GenTableColumn;
    this.Model = ctx.model;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.underlineToBigHump = ctx.underlineToBigHump;
    this.underlineToHump = ctx.underlineToHump;
    this.objUnderlineToHump = ctx.objUnderlineToHump;
    this.objHumpToUnderline = ctx.objHumpToUnderline;
    this.toInt = ctx.toInt;
    this.ctx = ctx;
    this.genModel = ctx.model;
  }

  /**
   * 代码生成模块
   * @param {*} query
   */
  async createZip(query) {
    try {
      if (this.ctx.app.isProcessingCodeCreate) {
        this.ctx.body = this.ServerResponse.createByErrorCodeMsgBusiness(70001);
        this.ctx.status = 200;
        return;
      }
      this.ctx.app.isProcessingCodeCreate = true;
      let moduleName = this.underlineToHump(query.tables);
      let data = await this.GenTable.findAll({
        where: {
          table_name: query.tables,
        },
        include: [
          {
            model: this.GenTableColumn,
          },
        ],
      });
      let newData = JSON.parse(JSON.stringify(data));
      let moduleType = data[0].dataValues.module_type;
      data = data[0].gen_table_columns.map((item) => {
        return this.objUnderlineToHump(item.dataValues);
      });
      //   let primaryKey = data.filter((item) => item.isPk == "1");
      //   primaryKey = primaryKey[0].columnName;
      let primaryKey =
        this.genModel.__proto__.models[query.tables].primaryKeyAttribute;
      await generateFiles(
        {
          moduleName,
          module: moduleType || "system",
          moduleClass:
            moduleName.slice(0, 1).toUpperCase() + moduleName.slice(1),
          data,
          primaryKey,
          newData,
          primaryKeyHub: this.underlineToHump(primaryKey),
        },
        tableCreateEvent
      );
      //将回调函数转换为promise 实现同步操作
      let zipData = await listenEvent(tableCreateEvent, "createTable");
      if (zipData.isCreatedTable) {
        await this.downLoadTableZip(moduleName);
      }
    } catch (error) {
      console.log(error);
      this.ctx.body = this.ServerResponse.createByErrorMsg(error);
      this.ctx.status = 200;
    }
  }

  /**
   * 下载模块
   * @param {*} moduleName 模块名称
   * @returns
   */
  downLoadTableZip(moduleName) {
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "genTable",
      `${moduleName}.zip`
    );
    //TODO临时修改
    this.ctx.app.isProcessingCodeCreate = false;
    if (fs.existsSync(filePath)) {
      this.ctx.status = 404;
      this.ctx.body = `找不到 ${moduleName}.zip 文件！${filePath}`;
      return;
    }
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    const range = this.ctx.headers.range;
    if (range) {
      // 处理 Range 请求
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const file = fs.createReadStream(filePath, { start, end });
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "application/zip",
      };

      this.ctx.status = 206;
      this.ctx.set(headers);
      this.ctx.body = file;
    } else {
      // 处理完整请求
      const headers = {
        "Content-Length": fileSize,
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=${moduleName}.zip`,
      };

      this.ctx.set(headers);
      this.ctx.body = fs.createReadStream(filePath);
    }
    this.ctx.app.isProcessingCodeCreate = false;
  }
}

module.exports = GenTableService;
