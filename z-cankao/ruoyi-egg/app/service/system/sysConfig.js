const Service = require("egg").Service;
const { Op } = require("sequelize");
class SysConfigService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SysConfig = ctx.model.SysConfig;
    this.redis = ctx.service.tool.redis;
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
    data = await this.SysConfig.findAndCountAll(
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
    data = await this.SysConfig.findAndCountAll(
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
    await this.SysConfig.create(
      Object.assign(
        {
          create_time: new Date(),
          update_time: new Date(),
        },
        this.objHumpToUnderline(params)
      )
    );
    await this.refreshCache();
    return this.ServerResponse.createBySuccessMsg("新增成功");
  }

  /**
   * 删除
   * @param {*} params
   */
  async delete(configId) {
    if (configId == "refreshCache") {
      return this.refreshCache();
    } else {
      let ids = configId.split(",");
      await this.SysConfig.destroy({
        where: {
          config_id: {
            [Op.in]: ids,
          },
        },
      });
      await this.refreshCache();
      return this.ServerResponse.createBySuccessMsg("删除成功！");
    }
  }

  /**
   * 修改数据
   * @param {*} params
   * @returns
   */
  async update(params, msg) {
    const findRepeat = await this.SysConfig.findByPk(params.configId);
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
      await this.refreshCache();
      return this.ServerResponse.createBySuccessMsg(msg || "修改成功");
    }
  }

  /**
   * 获取详情
   * @param {*} configId
   */
  async detail(configId) {
    let data = await this.SysConfig.findByPk(configId);
    data = this.objUnderlineToHump(data.dataValues);
    return this.ServerResponse.createBySuccessData(data);
  }

  /**
   * 刷新缓存
   */
  async refreshCache() {
    let data = await this.allList({});
    data.data = data.data.map((item) => {
      return {
        configKey: item.configKey,
        configValue: item.configValue,
      };
    });
    //存入缓存
    await this.redis.set(0, "sys_config", data.data);
    return this.ServerResponse.createBySuccessMsg("刷新成功");
  }

  /**
   * 根据关键字获取系统配置项
   * @param {*} configKey
   */
  async getKey(configKey) {
    let data = await this.redis.get(0, "sys_config");
    if (!data) {
      await this.refreshCache();
      data = await this.redis.get(0, "sys_config");
    }
    data = data.filter((item) => item.configKey == configKey);
    return this.ServerResponse.createBySuccessData(data[0]);
  }

  /**
   * 处理查询的参数
   */
  dealQuery(params) {
    let query = {
      where: {},
      order: [["config_id", "ASC"]],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //根据id进行查询
    if (params.configId) {
      query.where.config_id = params.configId;
    }

    //查询更新时间
    if (params.updateTime) {
      query.where.update_time = {
        [Op.between]: [
          params["params[updateTimeStart]"],
          params["params[updateTimeEnd]"],
        ],
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

    //查询系统内置（Y是 N否）
    if (params.configType) {
      query.where.config_type = {
        [Op.eq]: params.configType,
      };
    }

    //查询参数键值
    if (params.configValue) {
      query.where.config_value = {
        [Op.like]: `%${params.configValue}%`,
      };
    }

    //查询参数键名
    if (params.configKey) {
      query.where.config_key = {
        [Op.like]: `%${params.configKey}%`,
      };
    }

    //查询参数名称
    if (params.configName) {
      query.where.config_name = {
        [Op.like]: `%${params.configName}%`,
      };
    }

    return query;
  }
}

module.exports = SysConfigService;
