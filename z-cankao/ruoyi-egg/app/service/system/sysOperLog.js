const Service = require("egg").Service;
const { Op } = require("sequelize");
class SysOperLogService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SysOperLog = ctx.model.SysOperLog;
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
    data = await this.SysOperLog.findAndCountAll(
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
    data = await this.SysOperLog.findAndCountAll(
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
    await this.SysOperLog.create(
      Object.assign({}, this.objHumpToUnderline(params))
    );
    return this.ServerResponse.createBySuccessMsg("新增成功");
  }

  /**
   * 删除
   * @param {*} params
   */
  async delete(operId) {
    let ids = operId.split(",");
    await this.SysOperLog.destroy({
      where: {
        oper_id: {
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
    await this.SysOperLog.destroy({
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
    const findRepeat = await this.SysOperLog.findByPk(params.operId);
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
   * @param {*} operId
   */
  async detail(operId) {
    let data = await this.SysOperLog.findByPk(operId);
    data = this.objUnderlineToHump(data.dataValues);
    return this.ServerResponse.createBySuccessData(data);
  }

  /**
   * 处理查询的参数
   */
  dealQuery(params) {
    let query = {
      where: {},
      order: [["oper_id", "DESC"]],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //根据id进行查询
    if (params.operId) {
      query.where.oper_id = params.operId;
    }

    //查询模块标题
    if (params.title) {
      query.where.title = {
        [Op.like]: `%${params.title}%`,
      };
    }

    //查询操作状态（0正常 1异常）
    if (params.status) {
      query.where.status = {
        [Op.eq]: params.status,
      };
    }

    //查询操作类别（0其它 1后台用户 2手机端用户）
    if (params.operatorType) {
      query.where.operator_type = {
        [Op.eq]: params.operatorType,
      };
    }

    //操作类型
    if (params.businessType) {
      query.where.business_type = {
        [Op.eq]: params.businessType,
      };
    }

    //查询操作人员
    if (params.operName) {
      query.where.oper_name = {
        [Op.like]: `%${params.operName}%`,
      };
    }

    //查询操作时间
    if (params["params[beginTime]"]) {
      query.where.oper_time = {
        [Op.between]: [params["params[beginTime]"], params["params[endTime]"]],
      };
    }

    return query;
  }
}

module.exports = SysOperLogService;
