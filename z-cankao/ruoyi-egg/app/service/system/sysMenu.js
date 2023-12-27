const Service = require("egg").Service;
const { Op } = require("sequelize");
class SysMenuService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SysMenu = ctx.model.SysMenu;
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
    data = await this.SysMenu.findAndCountAll(
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
    data = await this.SysMenu.findAndCountAll(
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
    await this.SysMenu.create(
      Object.assign(
        {
          create_time: new Date(),
          update_time: new Date(),
        },
        this.objHumpToUnderline(params)
      )
    );
    return this.ServerResponse.createBySuccessMsg("新增成功");
  }

  /**
   * 删除
   * @param {*} params
   */
  async delete(menuId) {
    let ids = menuId.split(",");
    await this.SysMenu.destroy({
      where: {
        menu_id: {
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
    const findRepeat = await this.SysMenu.findByPk(params.menuId);
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
   * @param {*} menuId
   */
  async detail(menuId) {
    let data = await this.SysMenu.findByPk(menuId);
    data = this.objUnderlineToHump(data.dataValues);
    return this.ServerResponse.createBySuccessData(data);
  }

  /**
   * 处理查询的参数
   */
  dealQuery(params) {
    let query = {
      where: {},
      order: [
        ["order_num", "ASC"],
        ["menu_id", "ASC"],
      ],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //根据id进行查询
    if (params.menuId) {
      query.where.menu_id = params.menuId;
    }

    //查询创建时间
    if (params.createTime) {
      query.where.create_time = {
        [Op.between]: [
          params["params[createTimeStart]"],
          params["params[createTimeEnd]"],
        ],
      };
    }

    //查询菜单状态（0正常 1停用）
    if (params.status) {
      query.where.status = {
        [Op.eq]: params.status,
      };
    }

    //查询菜单名称
    if (params.menuName) {
      query.where.menu_name = {
        [Op.like]: `%${params.menuName}%`,
      };
    }

    return query;
  }
}

module.exports = SysMenuService;
