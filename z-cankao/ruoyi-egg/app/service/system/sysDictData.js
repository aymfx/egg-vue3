
const Service = require('egg').Service;
const { Op } = require("sequelize");
class SysDictDataService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SysDictData = ctx.model.SysDictData;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.objUnderlineToHump = ctx.objUnderlineToHump;
    this.objHumpToUnderline = ctx.objHumpToUnderline;
    this.toInt = ctx.toInt;
    this.userName = ctx.handleUser && ctx.handleUser.userName ? ctx.handleUser.userName : "";
  }

  /**
   * 分页查询
   * @param {*} params
   */
  async list(params) {
    let select = params.pageSize ? 1 : 0;
    params = this.dealQuery(params);
    let data;
    data = await this.SysDictData.findAndCountAll(
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
    data = await this.SysDictData.findAndCountAll(
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
    
    await this.SysDictData.create(
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
  async delete(dictCode) {
    let ids = dictCode.split(",");
    await this.SysDictData.destroy({
      where: {
        dict_code: {
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
    const findRepeat = await this.SysDictData.findByPk(params.dictCode);
    if (!findRepeat) {
      return this.ServerResponse.createByErrorCodeMsgBusiness(10013);
    } else {
      await findRepeat.update(
        Object.assign(
          {
            update_time:new Date()
          },
          this.objHumpToUnderline(params)
        )
      );
      return this.ServerResponse.createBySuccessMsg(msg || "修改成功");
    }
  }

  /**
   * 获取详情
   * @param {*} dictCode
   */
  async detail(dictCode) {
    let data = await this.SysDictData.findByPk(dictCode);
    data = this.objUnderlineToHump(data.dataValues);
    return this.ServerResponse.createBySuccessData(data);
  }

  /**
   * 处理查询的参数
   */
  dealQuery(params) {
    let query = {
      where: {},
      order: [["dict_code", "ASC"]],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //根据id进行查询
    if (params.dictCode) {
      query.where.dict_code = params.dictCode;
    }

    
    //查询状态（0正常 1停用）
    if (params.status) {
      query.where.status = {
        [Op.eq]:params.status
      }
    }
      
    //查询字典类型
    if (params.dictType) {
      query.where.dict_type = {
        [Op.eq]:params.dictType
      }
    }
      
    //查询字典标签
    if (params.dictLabel) {
      query.where.dict_label = {
        [Op.like]:`%${params.dictLabel}%`
      }
    }
      
    //查询字典编码
    if (params.dictCode) {
      query.where.dict_code = {
        [Op.eq]:params.dictCode
      }
    }
      

    return query;
  }
}

module.exports = SysDictDataService;
    