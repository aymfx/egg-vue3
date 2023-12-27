
const Controller = require('egg').Controller;

class SysUserRoleController extends Controller {
  /**
   * 普通分页查询
   * @param {*} ctx
   */
  async list(ctx) {
    ctx.body = await ctx.service.system.sysUserRole.list(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 获取列表数据
   * @param {*} ctx
   */
  async allList(ctx) {
    ctx.body = await ctx.service.system.sysUserRole.allList(ctx.request.query);
    ctx.status = 200;
  }

  
  
  /**
   * 删除
   * @param {*} ctx
   */
  async delete(ctx) {
    ctx.body = await ctx.service.system.sysUserRole.delete(ctx.params.noticeId);
    ctx.status = 200;
  }

  /**
   * 更新
   * @param {*} ctx
   */
  async update(ctx) {
    ctx.body = await ctx.service.system.sysUserRole.update(ctx.request.body);
    ctx.status = 200;
  }

  /**
   * 获取详情
   * @param {*} ctx
   */
  async detail(ctx) {
    ctx.body = await ctx.service.system.sysUserRole.detail(ctx.params.noticeId);
    ctx.status = 200;
  }

  /**
   * 创建
   * @param {*} ctx
   */
  async create(ctx) {
    ctx.body = await ctx.service.system.sysUserRole.create(ctx.request.body);
    ctx.status = 200;
  }

  async downLoad(ctx){
    let data = await ctx.service.system.sysUserRole.select(
      ctx.request.body,
      "new"
    );
    
    

    let downLoadModule = ctx.model.SysUserRole.fieldRawAttributesMap;
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

module.exports = SysUserRoleController;
    