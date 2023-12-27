/*
 * @Author: mark
 * @Date: 2023-08-14 03:00:02
 * @LastEditors: mark
 * @LastEditTime: 2023-08-31 06:53:53
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/controller/system/sysDept.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const Controller = require("egg").Controller;

class SysDeptController extends Controller {
  /**
   * 普通分页查询
   * @param {*} ctx
   */
  async list(ctx) {
    ctx.body = await ctx.service.system.sysDept.list(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 获取列表数据
   * @param {*} ctx
   */
  async allList(ctx) {
    ctx.body = await ctx.service.system.sysDept.allList(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 获取树形列表数据
   * @param {*} ctx
   */
  async tree(ctx) {
    ctx.body = await ctx.service.system.sysDept.tree(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 查询非本部门及下属的部门
   * @param {*} ctx
   */
  async excludeSelect(ctx) {
    ctx.body = await ctx.service.system.sysDept.excludeSelect(
      ctx.params.deptId
    );
    ctx.status = 200;
  }

  /**
   * 删除
   * @param {*} ctx
   */
  async delete(ctx) {
    ctx.body = await ctx.service.system.sysDept.delete(ctx.params.deptId);
    ctx.status = 200;
  }

  /**
   * 更新
   * @param {*} ctx
   */
  async update(ctx) {
    ctx.body = await ctx.service.system.sysDept.update(ctx.request.body);
    ctx.status = 200;
  }

  /**
   * 获取详情
   * @param {*} ctx
   */
  async detail(ctx) {
    ctx.body = await ctx.service.system.sysDept.detail(ctx.params.deptId);
    ctx.status = 200;
  }

  /**
   * 创建
   * @param {*} ctx
   */
  async create(ctx) {
    ctx.body = await ctx.service.system.sysDept.create(ctx.request.body);
    ctx.status = 200;
  }

  async excludeSelect(ctx) {
    ctx.body = await ctx.service.system.sysDept.excludeSelect(
      ctx.params.deptId
    );
    ctx.status = 200;
  }

  async downLoad(ctx) {
    let data = await ctx.service.system.sysDept.select(ctx.request.body, "new");

    let downLoadModule = ctx.model.SysDept.fieldRawAttributesMap;
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

module.exports = SysDeptController;
