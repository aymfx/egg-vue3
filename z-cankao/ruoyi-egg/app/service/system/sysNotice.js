const Service = require("egg").Service;
const { Op } = require("sequelize");
function bufferToString(bufferData) {
  if (Buffer.isBuffer(bufferData)) {
    return bufferData.toString("utf8");
  } else {
    return "Not a valid Buffer object";
  }
}
class SysNoticeService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SysNotice = ctx.model.SysNotice;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.objUnderlineToHump = ctx.objUnderlineToHump;
    this.objHumpToUnderline = ctx.objHumpToUnderline;
    this.toInt = ctx.toInt;
    this.userName =
      ctx.handleUser && ctx.handleUser.userName ? ctx.handleUser.userName : "";
  }

  /**
   * 分页查询
   * @param {*} params
   */
  async list(params) {
    let select = params.pageSize ? 1 : 0;
    params = this.dealQuery(params);
    let data;
    data = await this.SysNotice.findAndCountAll(
      Object.assign(params, { raw: true })
    );
    let total = data.count;
    let rows = data.rows;
    rows = rows.map((item) => {
      item.notice_content = item.notice_content.toString();
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
    data = await this.SysNotice.findAndCountAll(
      Object.assign(newParams, { raw: true })
    );
    let rows = data.rows;
    rows = rows.map((item) => {
      item.notice_content = item.notice_content.toString();
      return this.objUnderlineToHump(item);
    });
    return this.ServerResponse.createBySuccessData(rows);
  }

  /**
   * 新增
   * @returns
   */
  async create(params) {
    await this.SysNotice.create(
      Object.assign(
        {
          create_time: new Date(),
          update_time: new Date(),
        },
        this.objHumpToUnderline(params),
        {
          create_by: this.userName,
        }
      )
    );
    return this.ServerResponse.createBySuccessMsg("新增成功");
  }

  /**
   * 删除
   * @param {*} params
   */
  async delete(noticeId) {
    let ids = noticeId.split(",");
    await this.SysNotice.destroy({
      where: {
        notice_id: {
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
    const findRepeat = await this.SysNotice.findByPk(params.noticeId);
    if (!findRepeat) {
      return this.ServerResponse.createByErrorCodeMsgBusiness(10013);
    } else {
      await findRepeat.update(
        Object.assign(
          {
            update_time: new Date(),
          },
          this.objHumpToUnderline(params),
          {
            update_by: this.userName,
          }
        )
      );
      return this.ServerResponse.createBySuccessMsg(msg || "修改成功");
    }
  }

  /**
   * 获取详情
   * @param {*} noticeId
   */
  async detail(noticeId) {
    let data = await this.SysNotice.findByPk(noticeId);
    data.notice_content = data.notice_content.toString();
    data = this.objUnderlineToHump(data.dataValues);
    return this.ServerResponse.createBySuccessData(data);
  }

  /**
   * 处理查询的参数
   */
  dealQuery(params) {
    let query = {
      where: {},
      order: [["notice_id", "ASC"]],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //根据id进行查询
    if (params.noticeId) {
      query.where.notice_id = params.noticeId;
    }

    //查询更新时间
    if (params.updateTime) {
      query.where.update_time = {
        [Op.eq]: [
          params["params[updateTimeStart]"],
          params["params[updateTimeEnd]"],
        ],
      };
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

    //查询公告类型（1通知 2公告）
    if (params.noticeType) {
      query.where.notice_type = {
        [Op.eq]: params.noticeType,
      };
    }

    //查询公告标题
    if (params.noticeTitle) {
      query.where.notice_title = {
        [Op.like]: `%${params.noticeTitle}%`,
      };
    }

    //查询操作人员
    if (params.createBy) {
      query.where.create_by = {
        [Op.like]: `%${params.createBy}%`,
      };
    }

    return query;
  }
}

module.exports = SysNoticeService;
