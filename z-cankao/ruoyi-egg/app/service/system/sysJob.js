const Service = require("egg").Service;
const { Op } = require("sequelize");
class SysJobService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SysJob = ctx.model.SysJob;
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
    data = await this.SysJob.findAndCountAll(
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
    data = await this.SysJob.findAndCountAll(
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
    await this.SysJob.create(
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
  async delete(jobId) {
    let ids = jobId.split(",");
    await this.SysJob.destroy({
      where: {
        job_id: {
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
    const findRepeat = await this.SysJob.findByPk(params.jobId);
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
   * @param {*} jobId
   */
  async detail(jobId) {
    let data = await this.SysJob.findByPk(jobId);
    data = this.objUnderlineToHump(data.dataValues);
    return this.ServerResponse.createBySuccessData(data);
  }

  /**
   * 处理查询的参数
   */
  dealQuery(params) {
    let query = {
      where: {},
      order: [["job_id", "ASC"]],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //根据id进行查询
    if (params.jobId) {
      query.where.job_id = params.jobId;
    }

    //查询更新时间
    if (params.updateTime) {
      query.where.update_time = {
        [Op.eq]: params.updateTime,
      };
    }

    //查询更新者
    if (params.updateBy) {
      query.where.update_by = {
        [Op.eq]: params.updateBy,
      };
    }

    //查询状态（0正常 1暂停）
    if (params.status) {
      query.where.status = {
        [Op.eq]: params.status,
      };
    }

    //查询备注信息
    if (params.remark) {
      query.where.remark = {
        [Op.eq]: params.remark,
      };
    }

    //查询计划执行错误策略（1立即执行 2执行一次 3放弃执行）
    if (params.misfirePolicy) {
      query.where.misfire_policy = {
        [Op.eq]: params.misfirePolicy,
      };
    }

    //查询任务名称
    if (params.jobName) {
      query.where.job_name = {
        [Op.eq]: params.jobName,
      };
    }

    //查询任务ID
    if (params.jobId) {
      query.where.job_id = {
        [Op.eq]: params.jobId,
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

    //查询cron执行表达式
    if (params.cronExpression) {
      query.where.cron_expression = {
        [Op.eq]: params.cronExpression,
      };
    }

    //查询创建时间
    if (params.createTime) {
      query.where.create_time = {
        [Op.eq]: params.createTime,
      };
    }

    //查询创建者
    if (params.createBy) {
      query.where.create_by = {
        [Op.eq]: params.createBy,
      };
    }

    //查询是否并发执行（0允许 1禁止）
    if (params.concurrent) {
      query.where.concurrent = {
        [Op.eq]: params.concurrent,
      };
    }

    return query;
  }
}

module.exports = SysJobService;
