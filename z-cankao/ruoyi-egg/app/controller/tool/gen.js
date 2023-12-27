/*
 * @Author: mark
 * @Date: 2023-06-24 21:45:57
 * @LastEditors: mark
 * @LastEditTime: 2023-08-13 17:43:41
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/controller/tool/gen.js
 * @Description: 代码生成模块
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const Controller = require("egg").Controller;

class ToolGenController extends Controller {
  /**
   * 普通分页查询
   * @param {*} ctx
   */
  async list(ctx) {
    ctx.body = await ctx.service.tool.gen.list(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 查询数据表的数据
   * @param {*} ctx
   */
  async DBlist(ctx) {
    ctx.body = await ctx.service.tool.gen.DBlist(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 导入数据库新增
   * @param {*} ctx
   */
  async importTable(ctx) {
    ctx.body = await ctx.service.tool.gen.importTable(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 删除已导入的数据库
   * @param {*} ctx
   */
  async deleteTable(ctx) {
    ctx.body = await ctx.service.tool.gen.deleteTable(ctx.params);
    ctx.status = 200;
  }

  /**
   * 同步表结构
   * @param {*} ctx
   */
  async synchDb(ctx) {
    let tableName = ctx.params.tableName;
    ctx.body = await ctx.service.tool.gen.importTable({ tables: tableName });
    ctx.status = 200;
  }

  /**
   * 查询某个表的数据 同时如果传入的参数为batchGenCode 则表示代码生成模块
   * @param {*} ctx
   */
  async findOne(ctx) {
    if (ctx.params.tableId == "batchGenCode") {
      await ctx.service.tool.genTable.createZip(ctx.query);
    } else {
      ctx.body = await ctx.service.tool.gen.findOne(ctx.params);
      ctx.status = 200;
    }
  }

  /**
   * 修改数据
   * @param {*} ctx
   */
  async update(ctx) {
    ctx.body = await ctx.service.tool.gen.update(ctx.request.body);
    ctx.status = 200;
  }
}

module.exports = ToolGenController;
