/*
 * @Author: mark 
 * @Date: 2023-08-14 09:10:56
 * @LastEditors: mark 
 * @LastEditTime: 2023-08-25 07:06:20
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/controller/system/sysLogininfor.js
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
const Controller = require("egg").Controller;

class SysLogininforController extends Controller {
  /**
   * 普通分页查询
   * @param {*} ctx
   */
  async list(ctx) {
    ctx.body = await ctx.service.system.sysLogininfor.list(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 获取列表数据
   * @param {*} ctx
   */
  async allList(ctx) {
    ctx.body = await ctx.service.system.sysLogininfor.allList(
      ctx.request.query
    );
    ctx.status = 200;
  }

  /**
   * 删除
   * @param {*} ctx
   */
  async delete(ctx) {
    if (ctx.params.infoId == "clean") {
      ctx.body = await ctx.service.system.sysLogininfor.deleteAll(
        ctx.params.infoId
      );
    } else {
      ctx.body = await ctx.service.system.sysLogininfor.delete(
        ctx.params.infoId
      );
    }
    ctx.status = 200;
  }

  /**
   * 更新
   * @param {*} ctx
   */
  async update(ctx) {
    ctx.body = await ctx.service.system.sysLogininfor.update(ctx.request.body);
    ctx.status = 200;
  }

  /**
   * 获取详情
   * @param {*} ctx
   */
  async detail(ctx) {
    ctx.body = await ctx.service.system.sysLogininfor.detail(
      ctx.params.noticeId
    );
    ctx.status = 200;
  }

  /**
   * 创建
   * @param {*} ctx
   */
  async create(ctx) {
    ctx.body = await ctx.service.system.sysLogininfor.create(ctx.request.body);
    ctx.status = 200;
  }

  async downLoad(ctx) {
    let data = await ctx.service.system.sysLogininfor.allList(ctx.request.body);

    let downLoadModule = ctx.model.SysLogininfor.fieldRawAttributesMap;
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

module.exports = SysLogininforController;
