/*
 * @Author: mark
 * @Date: 2023-08-16 13:24:22
 * @LastEditors: mark
 * @LastEditTime: 2023-08-31 07:05:03
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/controller/system/sysMenu.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const Controller = require("egg").Controller;

class SysMenuController extends Controller {
  /**
   * 普通分页查询
   * @param {*} ctx
   */
  async list(ctx) {
    ctx.body = await ctx.service.system.sysMenu.list(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 获取列表数据
   * @param {*} ctx
   */
  async allList(ctx) {
    ctx.body = await ctx.service.system.sysMenu.allList(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 删除
   * @param {*} ctx
   */
  async delete(ctx) {
    ctx.body = await ctx.service.system.sysMenu.delete(ctx.params.menuId);
    ctx.status = 200;
  }

  /**
   * 更新
   * @param {*} ctx
   */
  async update(ctx) {
    ctx.body = await ctx.service.system.sysMenu.update(ctx.request.body);
    ctx.status = 200;
  }

  /**
   * 获取详情
   * @param {*} ctx
   */
  async detail(ctx) {
    ctx.body = await ctx.service.system.sysMenu.detail(ctx.params.menuId);
    ctx.status = 200;
  }

  /**
   * 创建
   * @param {*} ctx
   */
  async create(ctx) {
    ctx.body = await ctx.service.system.sysMenu.create(ctx.request.body);
    ctx.status = 200;
  }

  async downLoad(ctx) {
    let data = await ctx.service.system.sysMenu.allList(ctx.request.body);
    let downLoadModule = ctx.model.SysMenu.fieldRawAttributesMap;
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

module.exports = SysMenuController;
