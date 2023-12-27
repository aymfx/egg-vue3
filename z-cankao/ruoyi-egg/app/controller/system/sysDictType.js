/*
 * @Author: mark
 * @Date: 2023-08-29 06:52:49
 * @LastEditors: mark
 * @LastEditTime: 2023-08-30 07:16:11
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/controller/system/sysDictType.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const Controller = require("egg").Controller;

class SysDictTypeController extends Controller {
  /**
   * 普通分页查询
   * @param {*} ctx
   */
  async list(ctx) {
    ctx.body = await ctx.service.system.sysDictType.list(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 获取列表数据
   * @param {*} ctx
   */
  async allList(ctx) {
    ctx.body = await ctx.service.system.sysDictType.allList(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 删除
   * @param {*} ctx
   */
  async delete(ctx) {
    ctx.body = await ctx.service.system.sysDictType.delete(ctx.params.dictId);
    ctx.status = 200;
  }

  /**
   * 更新
   * @param {*} ctx
   */
  async update(ctx) {
    ctx.body = await ctx.service.system.sysDictType.update(ctx.request.body);
    ctx.status = 200;
  }

  /**
   * 获取相关的字典参数
   * @param {*} ctx
   */
  async getValue(ctx) {
    ctx.body = await ctx.service.system.sysDictType.getValue(
      ctx.params.dictType
    );
    ctx.status = 200;
  }

  /**
   * 获取详情
   * @param {*} ctx
   */
  async detail(ctx) {
    if (ctx.params.dictId == "optionselect") {
      ctx.body = await ctx.service.system.sysDictType.allList({});
    } else {
      ctx.body = await ctx.service.system.sysDictType.detail(ctx.params.dictId);
    }
    ctx.status = 200;
  }

  /**
   * 创建
   * @param {*} ctx
   */
  async create(ctx) {
    ctx.body = await ctx.service.system.sysDictType.create(ctx.request.body);
    ctx.status = 200;
  }

  async downLoad(ctx) {
    let data = await ctx.service.system.sysDictType.allList(ctx.request.body);

    let downLoadModule = ctx.model.SysDictType.fieldRawAttributesMap;
    let columnData = [];
    for (var key in downLoadModule) {
      columnData.push({
        header: downLoadModule[key].comment,
        key: ctx.underlineToHump(key),
        width: 15,
      });
    }
    if (data.code == 200) {
      await ctx.service.exportExcel.publicDownLoad(columnData, data.data);
    } else {
      ctx.body = data;
      ctx.status = 200;
    }
  }
}

module.exports = SysDictTypeController;
