const Service = require("egg").Service;
const { Op } = require("sequelize");
class SysJobLogService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SysJobLog = ctx.model.SysJobLog;
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
    data = await this.SysJobLog.findAndCountAll(
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
    data = await this.SysJobLog.findAndCountAll(
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
    await this.SysJobLog.create(
      Object.assign({}, this.objHumpToUnderline(params))
    );
    return this.ServerResponse.createBySuccessMsg("新增成功");
  }

  /**
   * 删除
   * @param {*} params
   */
  async delete(jobLogId) {
    let ids = jobLogId.split(",");
    await this.SysJobLog.destroy({
      where: {
        job_log_id: {
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
    const findRepeat = await this.SysJobLog.findByPk(params.jobLogId);
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
   * @param {*} jobLogId
   */
  async detail(jobLogId) {
    let data = await this.SysJobLog.findByPk(jobLogId);
    data = this.objUnderlineToHump(data.dataValues);
    return this.ServerResponse.createBySuccessData(data);
  }

  /**
   * 处理查询的参数
   */
  dealQuery(params) {
    let query = {
      where: {},
      order: [["job_log_id", "DESC"]],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //根据id进行查询
    if (params.jobLogId) {
      query.where.job_log_id = params.jobLogId;
    }

    //查询执行状态（0正常 1失败）
    if (params.status) {
      query.where.status = {
        [Op.eq]: params.status,
      };
    }

    //查询任务名称
    if (params.jobName) {
      query.where.job_name = {
        [Op.eq]: params.jobName,
      };
    }

    //查询日志信息
    if (params.jobMessage) {
      query.where.job_message = {
        [Op.eq]: params.jobMessage,
      };
    }

    //查询任务日志ID
    if (params.jobLogId) {
      query.where.job_log_id = {
        [Op.eq]: params.jobLogId,
      };
    }

    //查询任务组名
    if (params.jobGroup) {
      query.where.job_group = {
        [Op.eq]: params.jobGroup,
      };
    }

    //查询调用目标字符串
    if (params.invokeTarget) {
      query.where.invoke_target = {
        [Op.eq]: params.invokeTarget,
      };
    }

    //查询异常信息
    if (params.exceptionInfo) {
      query.where.exception_info = {
        [Op.eq]: params.exceptionInfo,
      };
    }

    //查询创建时间
    if (params.createTime) {
      query.where.create_time = {
        [Op.eq]: params.createTime,
      };
    }

    return query;
  }
}

module.exports = SysJobLogService;
