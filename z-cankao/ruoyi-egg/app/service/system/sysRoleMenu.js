const Service = require("egg").Service;
const { Op } = require("sequelize");
class SysRoleMenuService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SysRoleMenu = ctx.model.SysRoleMenu;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.objUnderlineToHump = ctx.objUnderlineToHump;
    this.objHumpToUnderline = ctx.objHumpToUnderline;
    this.toInt = ctx.toInt;
  }

  /**
   * 分页查询
   * @param {*} params
   */
  async list(params) {
    let select = params.pageSize ? 1 : 0;
    params = this.dealQuery(params);
    let data;
    data = await this.SysRoleMenu.findAndCountAll(
      Object.assign(params, { raw: true })
    );
    let total = data.count;
    let rows = data.rows;
    rows = rows.map((item) => {
      return this.objUnderlineToHump(item);
    });
    return select
      ? this.ServerResponse.createBySuccessMsgAndData(
          "请求成功",
          {},
          {
            rows,
            total,
          }
        )
      : this.ServerResponse.createBySuccessData(rows);
  }

  /**
   * 获取所有列表数据
   * @param {*} params
   * @returns
   */
  async allList(params) {
    let newParams = this.dealQuery(params);
    delete newParams.pageSize;
    delete newParams.pageNum;
    let data;
    data = await this.SysRoleMenu.findAndCountAll(
      Object.assign(newParams, { raw: true })
    );
    let rows = data.rows;
    rows = rows.map((item) => {
      return this.objUnderlineToHump(item);
    });
    return this.ServerResponse.createBySuccessData(rows);
  }

  /**
   * 新增
   * @returns
   */
  async create(params) {
    await this.SysRoleMenu.create(
      Object.assign({}, this.objHumpToUnderline(params))
    );
    return this.ServerResponse.createBySuccessMsg("新增成功");
  }

  /**
   * 删除
   * @param {*} params
   */
  async delete(roleId) {
    let ids = roleId.split(",");
    await this.SysRoleMenu.destroy({
      where: {
        role_id: {
          [Op.in]: ids,
        },
      },
    });
    return this.ServerResponse.createBySuccessMsg("删除成功！");
  }

  /**
   * 修改数据
   * @param {*} params
   * @returns
   */
  async update(params, msg) {
    const findRepeat = await this.SysRoleMenu.findByPk(params.roleId);
    if (!findRepeat) {
      return this.ServerResponse.createByErrorCodeMsgBusiness(10013);
    } else {
      await findRepeat.update(
        Object.assign(
          {
            update_time: new Date(),
          },
          this.objHumpToUnderline(params)
        )
      );
      return this.ServerResponse.createBySuccessMsg(msg || "修改成功");
    }
  }

  /**
   * 获取详情
   * @param {*} roleId
   */
  async detail(roleId) {
    let data = await this.SysRoleMenu.findByPk(roleId);
    data = this.objUnderlineToHump(data.dataValues);
    return this.ServerResponse.createBySuccessData(data);
  }

  /**
   * 处理查询的参数
   */
  dealQuery(params) {
    let query = {
      where: {},
      order: [["role_id", "ASC"]],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //根据id进行查询
    if (params.roleId) {
      query.where.role_id = params.roleId;
    }

    //查询角色ID
    if (params.roleId) {
      query.where.role_id = {
        [Op.eq]: params.roleId,
      };
    }

    //查询菜单ID
    if (params.menuId) {
      query.where.menu_id = {
        [Op.eq]: params.menuId,
      };
    }

    return query;
  }
}

module.exports = SysRoleMenuService;
