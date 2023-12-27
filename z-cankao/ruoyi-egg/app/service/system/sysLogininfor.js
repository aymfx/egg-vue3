const Service = require("egg").Service;
const { Op } = require("sequelize");
class SysLogininforService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SysLogininfor = ctx.model.SysLogininfor;
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
    data = await this.SysLogininfor.findAndCountAll(
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
    delete newParams.limit;
    delete newParams.offset;
    let data;
    data = await this.SysLogininfor.findAndCountAll(
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
    await this.SysLogininfor.create(
      Object.assign({}, this.objHumpToUnderline(params))
    );
    return this.ServerResponse.createBySuccessMsg("新增成功");
  }

  /**
   * 删除
   * @param {*} params
   */
  async delete(infoId) {
    let ids = infoId.split(",");
    await this.SysLogininfor.destroy({
      where: {
        info_id: {
          [Op.in]: ids,
        },
      },
    });
    return this.ServerResponse.createBySuccessMsg("删除成功！");
  }

  /**
   * 清空
   * @param {*} params
   */
  async deleteAll() {
    await this.SysLogininfor.destroy({
      where: {},
      truncate: true,
    });
    return this.ServerResponse.createBySuccessMsg("删除成功！");
  }

  /**
   * 修改数据
   * @param {*} params
   * @returns
   */
  async update(params, msg) {
    const findRepeat = await this.SysLogininfor.findByPk(params.infoId);
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
   * @param {*} infoId
   */
  async detail(infoId) {
    let data = await this.SysLogininfor.findByPk(infoId);
    data = this.objUnderlineToHump(data.dataValues);
    return this.ServerResponse.createBySuccessData(data);
  }

  /**
   * 处理查询的参数
   */
  dealQuery(params) {
    let query = {
      where: {},
      order: [["info_id", "DESC"]],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //根据id进行查询
    if (params.infoId) {
      query.where.info_id = params.infoId;
    }

    //查询用户账号
    if (params.userName) {
      query.where.user_name = {
        [Op.like]: `%${params.userName}%`,
      };
    }

    //查询登录状态（0成功 1失败）
    if (params.status) {
      query.where.status = {
        [Op.eq]: params.status,
      };
    }

    //查询访问时间
    if (params["params[beginTime]"]) {
      query.where.login_time = {
        [Op.between]: [params["params[beginTime]"], params["params[endTime]"]],
      };
    }

    //查询登录地点
    if (params.loginLocation) {
      query.where.login_location = {
        [Op.like]: `%${params.loginLocation}%`,
      };
    }

    //查询登录IP地址
    if (params.ipaddr) {
      query.where.ipaddr = {
        [Op.like]: `%${params.ipaddr}%`,
      };
    }

    return query;
  }
}

module.exports = SysLogininforService;
