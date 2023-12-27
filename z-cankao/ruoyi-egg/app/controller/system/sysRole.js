const Controller = require("egg").Controller;

class SysRoleController extends Controller {
  /**
   * 普通分页查询
   * @param {*} ctx
   */
  async list(ctx) {
    ctx.body = await ctx.service.system.sysRole.list(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 获取列表数据
   * @param {*} ctx
   */
  async allList(ctx) {
    ctx.body = await ctx.service.system.sysRole.allList(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 删除
   * @param {*} ctx
   */
  async delete(ctx) {
    ctx.body = await ctx.service.system.sysRole.delete(ctx.params.roleId);
    ctx.status = 200;
  }

  /**
   * 更新
   * @param {*} ctx
   */
  async update(ctx) {
    ctx.body = await ctx.service.system.sysRole.update(ctx.request.body);
    ctx.status = 200;
  }

  /**
   * 修改数据
   * @param {*} ctx
   */
  async changeData(ctx) {
    ctx.body = await ctx.service.system.sysRole.update(ctx.request.body);
    ctx.status = 200;
  }

  /**
   * 获取详情
   * @param {*} ctx
   */
  async detail(ctx) {
    ctx.body = await ctx.service.system.sysRole.detail(ctx.params.roleId);
    ctx.status = 200;
  }

  /**
   * 创建
   * @param {*} ctx
   */
  async create(ctx) {
    ctx.body = await ctx.service.system.sysRole.create(ctx.request.body);
    ctx.status = 200;
  }

  /**
   * 批量授权用户角色
   * @param {*} ctx
   */
  async selectAll(ctx) {
    let resData = [];
    if (ctx.params.type && ctx.params.type != "selectAll") {
      //取消授权
      await ctx.service.system.sysUserRole.singleDel(ctx.request.body);
      ctx.status = 200;
    } else {
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

  async getIdRole(ctx) {
    let data = Object.assign(ctx.request.body, {
      roleId: ctx.toInt(ctx.params.roleId),
    });
    ctx.body = await ctx.service.system.sysRole.getIdRole(data);
    ctx.status = 200;
  }

  /**
   * 查询角色下所有的用户
   */
  async allocatedList(ctx) {
    ctx.body = await ctx.service.system.sysRole.allocatedList(
      ctx.request.query,
      ctx.params.type
    );
    ctx.status = 200;
  }

  async destroy(ctx) {
    let params = null;
    if (ctx.params.id.indexOf(",") > -1) {
      params = ctx.params.id.split(",");
      params = params.map((item) => {
        return ctx.toInt(item);
      });
    } else {
      params = [ctx.toInt(ctx.params.id)];
    }
    let data = {
      roleId: params,
    };
    ctx.body = await ctx.service.system.sysRole.delete(data);
    ctx.status = 200;
  }

  async downLoad(ctx) {
    let data = await ctx.service.system.sysRole.allList(ctx.request.body);
    let downLoadModule = ctx.model.SysRole.fieldRawAttributesMap;
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

module.exports = SysRoleController;
