const Service = require("egg").Service;
const { Op } = require("sequelize");
class NoticeService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SysNotice = ctx.model.SysNotice;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.underlineToBigHump = ctx.underlineToBigHump;
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
    data = await this.SysNotice.findAndCountAll(
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
    data = await this.SysNotice.findAndCountAll(
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
   * @param {*} params
   */
  async create(params) {
    await this.SysNotice.create(this.objHumpToUnderline(params));
    return this.ServerResponse.createBySuccessMsg("新增成功！");
  }

  /**
   * 删除
   * @param {*} noticeId
   * @returns
   */
  async delete(noticeId) {
    let notice = noticeId.split(",");
    await this.SysNotice.destroy({
      where: {
        notice_id: {
          [Op.in]: notice,
        },
      },
    });
    return this.ServerResponse.createBySuccessMsg("删除成功！");
  }

  /**
   * 更新
   * @param {*} params
   */
  async update(params) {
    let data = await this.SysNotice.findByPk(params.noticeId);
    if (!data) {
      return this.ServerResponse.createByErrorCodeMsgBusiness(10013);
    } else {
      await this.SysNotice.update(this.objHumpToUnderline(params), {
        where: {
          notice_id: params.noticeId,
        },
      });
      return this.ServerResponse.createBySuccessMsg("修改成功！");
    }
  }

  /**
   * 获取详情
   * @param {*} noticeId
   */
  async detail(noticeId) {
    let data = await this.SysNotice.findByPk(noticeId);
    data = this.objUnderlineToHump(data.dataValues);
    data.noticeContent = data.noticeContent.toString();
    return this.ServerResponse.createBySuccessData(data);
  }

  /**
   * 处理查询的参数
   */
  dealQuery(params) {
    let query = {
      where: {},
      order: [],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //公告标题
    if (params.noticeTitle) {
      query.where.notice_title = {
        [Op.like]: `%${params.noticeTitle}%`,
      };
    }

    //操作人员
    if (params.createBy) {
      query.where.create_by = {
        [Op.like]: `%${params.createBy}%`,
      };
    }

    //通知类型
    if (params.noticeType) {
      query.where.notice_type = params.noticeType;
    }
    return query;
  }
}

module.exports = NoticeService;
