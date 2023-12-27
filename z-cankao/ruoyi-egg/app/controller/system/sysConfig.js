/*
 * @Author: mark
 * @Date: 2023-08-13 09:03:34
 * @LastEditors: mark
 * @LastEditTime: 2023-08-28 07:00:15
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/controller/system/sysConfig.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const Controller = require("egg").Controller;

class SysConfigController extends Controller {
  /**
   * 普通分页查询
   * @param {*} ctx
   */
  async list(ctx) {
    ctx.body = await ctx.service.system.sysConfig.list(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 获取列表数据
   * @param {*} ctx
   */
  async allList(ctx) {
    ctx.body = await ctx.service.system.sysConfig.allList(ctx.request.query);
    ctx.status = 200;
  }

  async getKey(ctx) {
    ctx.body = await ctx.service.system.sysConfig.getKey(ctx.params.configKey);
    ctx.status = 200;
  }

  /**
   * 删除
   * @param {*} ctx
   */
  async delete(ctx) {
    ctx.body = await ctx.service.system.sysConfig.delete(ctx.params.configId);
    ctx.status = 200;
  }

  /**
   * 更新
   * @param {*} ctx
   */
  async update(ctx) {
    ctx.body = await ctx.service.system.sysConfig.update(ctx.request.body);
    ctx.status = 200;
  }

  /**
   * 获取详情
   * @param {*} ctx
   */
  async detail(ctx) {
    ctx.body = await ctx.service.system.sysConfig.detail(ctx.params.configId);
    ctx.status = 200;
  }

  /**
   * 创建
   * @param {*} ctx
   */
  async create(ctx) {
    ctx.body = await ctx.service.system.sysConfig.create(ctx.request.body);
    ctx.status = 200;
  }

  /**
   * 刷新缓存
   */
  async refreshCache(ctx) {
    ctx.body = await ctx.service.system.sysConfig.refreshCache();
    ctx.status = 200;
  }

  async downLoad(ctx) {
    let data = await ctx.service.system.sysConfig.allList(ctx.request.query);

    let downLoadModule = ctx.model.SysConfig.fieldRawAttributesMap;
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

module.exports = SysConfigController;
