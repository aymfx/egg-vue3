const Service = require("egg").Service;
const { Op } = require("sequelize");
class SysDeptService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SysDept = ctx.model.SysDept;
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
    data = await this.SysDept.findAndCountAll(
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
    data = await this.SysDept.findAndCountAll(
      Object.assign(newParams, { raw: true })
    );
    let rows = data.rows;
    rows = rows.map((item) => {
      return this.objUnderlineToHump(item);
    });
    return this.ServerResponse.createBySuccessData(rows);
  }

  /**
   * 生成树形返回
   * @param {*} params
   * @returns
   */
  async tree(params) {
    let res = await this.allList(params);
    res.data = res.data.map((item) => {
      item.label = item.deptName;
      item.id = item.deptId;
      return item;
    });
    res = this.ctx.changeToTree(res.data, "parentId", "deptId");
    return this.ServerResponse.createBySuccessData(res);
  }

  /**
   * 新增
   * @returns
   */
  async create(params) {
    let ancestors = await this.SysDept.findByPk(params.parentId);
    ancestors = ancestors.dataValues.ancestors + "," + params.parentId;
    await this.SysDept.create(
      Object.assign(
        {
          create_time: new Date(),
          update_time: new Date(),
        },
        this.objHumpToUnderline(params),
        { ancestors }
      )
    );
    return this.ServerResponse.createBySuccessMsg("新增成功");
  }

  /**
   * 删除
   * @param {*} params
   */
  async delete(deptId) {
    let ids = deptId.split(",");
    await this.SysDept.destroy({
      where: {
        dept_id: {
          [Op.in]: ids,
        },
      },
    });
    return this.ServerResponse.createBySuccessMsg("删除成功！");
  }

  /**
   * 更新部门的数据
   * 关联进行更新而不是单条更新
   * @param {*} params
   */
  async updateDept(params) {
    let PKData = await this.SysDept.findByPk(params.deptId);
    PKData = PKData.dataValues;
    //当层级结构发生改变时
    if (
      PKData.ancestors != params.ancestors ||
      params.parentId != PKData.parent_id
    ) {
      //找到新的父级对应的上级
      let parentData = await this.SysDept.findByPk(params.parentId);
      parentData = parentData.dataValues;
      params.ancestors = parentData.ancestors + "," + params.parentId;

      //找到下级
      let childData = await this.SysDept.findAll({
        where: {
          ancestors: {
            [Op.regexp]: `(^|,)${params.deptId}(,|$)`,
          },
        },
      });
      childData = childData.map((item) => {
        item.dataValues.ancestors = params.ancestors + "," + params.deptId;
        return item.dataValues;
      });
      //需要更改的数据
      childData.push(this.objHumpToUnderline(params));
      childData = childData.map((item) => {
        item.update_time = new Date();
        return item;
      });
      await this.SysDept.bulkCreate(childData, {
        updateOnDuplicate: [
          "parent_id",
          "ancestors",
          "dept_name",
          "order_num",
          "leader",
          "phone",
          "email",
          "status",
          "del_flag",
          "update_time",
        ],
      });

      return this.ServerResponse.createBySuccessMsg("修改成功");
    } else {
      return await this.update(params);
    }
  }

  /**
   * 查询非本部门及下属部门的部门
   * @param {*} deptId
   * @returns
   */
  async excludeSelect(deptId) {
    let data = await this.SysDept.findAll({
      where: {
        [Op.and]: {
          ancestors: {
            [Op.notRegexp]: `(^|,)${deptId}(,|$)`,
          },
          dept_id: {
            [Op.not]: deptId,
          },
        },
      },
    });
    data = data.map((item) => {
      return this.objUnderlineToHump(item.dataValues);
    });
    return this.ServerResponse.createBySuccessMsgAndData("请求成功", data);
  }

  /**
   * 修改数据
   * @param {*} params
   * @returns
   */
  async update(params, msg) {
    const findRepeat = await this.SysDept.findByPk(params.deptId);
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
   * @param {*} deptId
   */
  async detail(deptId) {
    let data = await this.SysDept.findByPk(deptId);
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
        ["dept_id", "ASC"],
      ],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //根据id进行查询
    if (params.deptId) {
      query.where.dept_id = params.deptId;
    }

    //查询负责人
    if (params.leader) {
      query.where.leader = {
        [Op.like]: `%${params.leader}%`,
      };
    }

    //查询部门名称
    if (params.deptName) {
      query.where.dept_name = {
        [Op.like]: `%${params.deptName}%`,
      };
    }

    //根据状态查询
    if (params.status) {
      query.where.status = params.status;
    }

    return query;
  }
}

module.exports = SysDeptService;
