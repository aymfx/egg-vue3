/*
 * @Author: mark
 * @Date: 2023-08-14 02:30:04
 * @LastEditors: mark
 * @LastEditTime: 2023-09-03 18:30:58
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/controller/system/sysUser.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const Controller = require("egg").Controller;

class SysUserController extends Controller {
  /**
   * 普通分页查询
   * @param {*} ctx
   */
  async list(ctx) {
    ctx.body = await ctx.service.system.sysUser.list(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 获取列表数据
   * @param {*} ctx
   */
  async allList(ctx) {
    ctx.body = await ctx.service.system.sysUser.allList(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 获取用户部门的数据
   * @param {*} ctx
   */
  async deptTree(ctx) {
    ctx.body = await ctx.service.system.sysDept.tree(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 删除
   * @param {*} ctx
   */
  async delete(ctx) {
    ctx.body = await ctx.service.system.sysUser.delete(ctx.params.userId);
    ctx.status = 200;
  }

  /**
   * 更新
   * @param {*} ctx
   */
  async update(ctx) {
    ctx.body = await ctx.service.system.sysUser.update(ctx.request.body);
    ctx.status = 200;
  }

  /**
   * 获取详情
   * @param {*} ctx
   */
  async detail(ctx) {
    if (ctx.params.userId == "deptTree") {
      this.deptTree(ctx);
      return;
    }
    ctx.body = await ctx.service.system.sysUser.detail(
      ctx.params.userId ? ctx.params.userId : 0
    );
    ctx.status = 200;
  }

  /**
   * 重置密码
   */
  async resetPwd(ctx) {
    ctx.body = await ctx.service.system.sysUser.resetPwd(ctx.request.body);
    ctx.status = 200;
  }

  /**
   * 创建
   * @param {*} ctx
   */
  async create(ctx) {
    ctx.body = await ctx.service.system.sysUser.create(ctx.request.body);
    ctx.status = 200;
  }

  async downLoad(ctx) {
    let data = await ctx.service.system.sysUser.allList(ctx.request.body);

    let downLoadModule = ctx.model.SysUser.fieldRawAttributesMap;
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

  //查询用户角色信息
  async getAuthRole(ctx) {
    let userId = ctx.params.userId;
    let userData = await ctx.service.system.sysUser.allList({
      userId,
    });
    let userRoles = await ctx.model.SysUserRole.findAll({
      where: {
        user_id: userId,
      },
      //返回时model还是json true表示json
      raw: false,
      include: [
        {
          model: ctx.model.SysRole,
        },
      ],
    });
    userRoles = userRoles.map((item) => {
      return ctx.objUnderlineToHump(item.dataValues.sys_role.dataValues);
    });
    let roleData = await ctx.service.system.sysRole.allList({});
    let roles = [];
    roleData.data.forEach((item2) => {
      if (item2.roleName != "超级管理员") {
        userRoles.forEach((element) => {
          if (element.roleId == item2.roleId) {
            item2.flag = true;
          }
        });
        roles.push(item2);
      }
    });
    ctx.body = {
      code: 200,
      msg: "操作成功",
      roles,
      user: Object.assign(userData.data[0], { roles: userRoles }),
    };
  }

  /**
   * 修改用户信息
   * @param {*} ctx
   */
  async updateAuthRole(ctx) {
    let resData = [];
    if (ctx.query.userIds) {
      let roleId = ctx.query.roleId;
      let userIds = ctx.query.userIds.split(",");
      await ctx.service.system.sysUserRole.delete(roleId + "");
      for (let i of userIds) {
        resData.push(
          await ctx.service.system.sysUserRole.create({
            roleId,
            userId: i,
          })
        );
      }
    } else if (ctx.query.roleIds) {
      let roleIds = ctx.query.roleIds.split(",");
      let userId = ctx.query.userId;
      await ctx.service.system.sysUserRole.delete(userId + "");
      for (let i of roleIds) {
        resData.push(
          await ctx.service.system.sysUserRole.create({
            roleId: i,
            userId,
          })
        );
      }
    }

    resData = resData.filter((item) => item.code != 200);
    if (resData.length) {
      ctx.body =
        this.ctx.response.ServerResponse.createByErrorCodeMsgBusiness(10015);
    } else {
      ctx.body =
        this.ctx.response.ServerResponse.createBySuccessMsg("授权成功");
    }

    ctx.status = 200;
  }
}

module.exports = SysUserController;
