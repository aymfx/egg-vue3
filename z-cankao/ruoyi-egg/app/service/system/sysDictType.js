const Service = require("egg").Service;
const { Op } = require("sequelize");
class SysDictTypeService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SysDictType = ctx.model.SysDictType;
    this.SysDictData = ctx.model.SysDictData;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.objUnderlineToHump = ctx.objUnderlineToHump;
    this.objHumpToUnderline = ctx.objHumpToUnderline;
    this.toInt = ctx.toInt;
    this.redis = ctx.service.tool.redis;
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
    data = await this.SysDictType.findAndCountAll(
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
    data = await this.SysDictType.findAndCountAll(
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
    await this.SysDictType.create(
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
    await this.refreshCache();
    return this.ServerResponse.createBySuccessMsg("新增成功");
  }

  /**
   * 删除
   * @param {*} params
   */
  async delete(dictId) {
    if (dictId == "refreshCache") {
      await this.refreshCache();
    } else {
      let ids = dictId.split(",");
      await this.SysDictType.destroy({
        where: {
          dict_id: {
            [Op.in]: ids,
          },
        },
      });
    }
    await this.refreshCache();
    return this.ServerResponse.createBySuccessMsg("删除成功！");
  }

  /**
   * 强制刷新所有字典缓存
   */
  async refreshCache() {
    this.SysDictType.hasMany(this.SysDictData, {
      foreignKey: "dict_type",
      sourceKey: "dict_type",
    });
    let data = await this.SysDictType.findAll({
      include: [
        {
          model: this.SysDictData,
        },
      ],
    });
    data = data.map((item) => {
      item = item.dataValues;
      item.sys_dict_data = item.sys_dict_data.map((item2) => {
        return this.objUnderlineToHump(item2.dataValues);
      });
      item = this.objUnderlineToHump(item);
      return item;
    });
    let set = {};
    data.forEach((item) => {
      set[item.dictType] = item.sysDictData;
    });
    //存入缓存
    await this.redis.set(0, "sys_dict", set);
    return this.ServerResponse.createBySuccessMsg("刷新成功");
  }

  /**
   * 修改数据
   * @param {*} params
   * @returns
   */
  async update(params, msg) {
    const findRepeat = await this.SysDictType.findByPk(params.dictId);
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
      await this.refreshCache();
      return this.ServerResponse.createBySuccessMsg(msg || "修改成功");
    }
  }

  /**
   * 获取详情
   * @param {*} dictId
   */
  async detail(dictId) {
    let data = await this.SysDictType.findByPk(dictId);
    data = this.objUnderlineToHump(data.dataValues);
    return this.ServerResponse.createBySuccessData(data);
  }

  /**
   * 根据某个字典类型获取具体的数据
   * @param {*} dictType
   */
  async getValue(dictType) {
    let data = await this.redis.get(0, "sys_dict");
    if (!data) {
      //找不到数据就更新一下缓存
      await this.refreshCache();
      data = await this.redis.get(0, "sys_dict");
    }
    return this.ServerResponse.createBySuccessData(
      data[dictType] ? data[dictType] : []
    );
  }

  /**
   * 处理查询的参数
   */
  dealQuery(params) {
    let query = {
      where: {},
      order: [["dict_id", "ASC"]],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //根据id进行查询
    if (params.dictId) {
      query.where.dict_id = params.dictId;
    }

    //查询状态（0正常 1停用）
    if (params.status) {
      query.where.status = {
        [Op.eq]: params.status,
      };
    }

    //查询字典类型
    if (params.dictType) {
      query.where.dict_type = {
        [Op.like]: `%${params.dictType}%`,
      };
    }

    //查询字典名称
    if (params.dictName) {
      query.where.dict_name = {
        [Op.like]: `%${params.dictName}%`,
      };
    }

    //查询字典主键
    if (params.dictId) {
      query.where.dict_id = {
        [Op.eq]: params.dictId,
      };
    }

    //查询创建时间
    if (params["params[createTimeStart]"]) {
      query.where.create_time = {
        [Op.between]: [
          params["params[createTimeStart]"],
          params["params[createTimeEnd]"],
        ],
      };
    }

    return query;
  }
}

module.exports = SysDictTypeService;
