const Service = require("egg").Service;
const { Op } = require("sequelize");
//加密模块
const utility = require("utility");
class SysUserService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SysUser = ctx.model.SysUser;
    this.SysPost = ctx.model.SysPost;
    this.SysRole = ctx.model.SysRole;
    this.SysDept = ctx.model.SysDept;
    this.SysUserRole = ctx.model.SysUserRole;
    this.SysUserPost = ctx.model.SysUserPost;
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
    params = await this.dealQuery(params);
    let data;
    data = await this.SysUser.findAndCountAll(
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
    let newParams = await this.dealQuery(params);
    delete newParams.pageSize;
    delete newParams.pageNum;
    let data;
    data = await this.SysUser.findAndCountAll(
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
    let role = params.roleIds;
    let post = params.postIds;
    params.password = utility.md5(params.password);
    delete params.roleIds;
    delete params.postIds;
    let data = await this.SysUser.create(
      Object.assign(
        {
          create_time: new Date(),
          update_time: new Date(),
        },
        this.objHumpToUnderline(params)
      )
    );
    let user_id = data.dataValues.user_id;
    role = role.map((item) => {
      return {
        user_id,
        role_id: item,
      };
    });
    post = post.map((item) => {
      return {
        user_id,
        post_id: item,
      };
    });
    await this.SysUserRole.bulkCreate(role);
    await this.SysUserPost.bulkCreate(post);
    return this.ServerResponse.createBySuccessMsg("新增成功");
  }

  /**
   * 删除
   * @param {*} params
   */
  async delete(userId) {
    let ids = userId.split(",");
    await this.SysUser.destroy({
      where: {
        user_id: {
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
    if (params.password) {
      params.password = utility.md5(params.password);
    }
    const findRepeat = await this.SysUser.findByPk(params.userId);
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
      //删除所有role并添加上所有的role
      await this.SysUserRole.destroy({
        where: {
          user_id: params.userId,
        },
      });
      let addRole = params.roleIds.map((item) => {
        return {
          user_id: params.userId,
          role_id: item,
        };
      });
      await this.SysUserRole.bulkCreate(addRole);
      //删除所有post并添加上post
      await this.SysUserPost.destroy({
        where: {
          user_id: params.userId,
        },
      });
      let addPost = params.postIds.map((item) => {
        return {
          user_id: params.userId,
          post_id: item,
        };
      });
      await this.SysUserPost.bulkCreate(addPost);
      return this.ServerResponse.createBySuccessMsg(msg || "修改成功");
    }
  }

  /**
   * 更改密码
   * @param {*} params
   */
  async resetPwd(params) {
    params.password = utility.md5(params.password);
    return await this.update(params);
  }

  /**
   * 获取详情
   * @param {*} userId
   */
  async detail(userId) {
    if (userId == 0) {
      let posts = await this.ctx.service.system.sysPost.allList({});
      let roles = await this.ctx.service.system.sysRole.allList({});
      posts = posts.data;
      roles = roles.data.filter((item) => item.roleName != "超级管理员");
      return this.ServerResponse.createBySuccessMsgAndData(
        "查询成功",
        {},
        Object.assign(
          {
            code: 200,
            msg: "操作成功",
          },
          {
            roles,
            posts,
          }
        )
      );
    }
    let data = await this.SysUser.findAll({
      where: {
        user_id: userId,
      },
      include: [{ model: this.SysPost }, { model: this.SysRole }],
    });
    data = data.map((item) => {
      item.dataValues.postIds = item.dataValues.sys_posts.map((item2) => {
        return item2.dataValues.post_id;
      });
      delete item.dataValues.sys_posts;
      item.dataValues.roleIds = item.dataValues.sys_roles.map((item2) => {
        return item2.dataValues.role_id;
      });
      delete item.dataValues.sys_roles;
      return item.dataValues;
    });
    let posts = await this.ctx.service.system.sysPost.allList({});
    let roles = await this.ctx.service.system.sysRole.allList({});
    data = this.objUnderlineToHump(data[0]);
    let roleIds = data.roleids;
    let postIds = data.postids;
    posts = posts.data;
    roles = roles.data.filter((item) => item.roleName != "超级管理员");

    return this.ServerResponse.createBySuccessMsgAndData(
      "查询成功",
      {},
      Object.assign(
        {
          code: 200,
          msg: "操作成功",
        },
        {
          data,
          postIds,
          roleIds,
          roles,
          posts,
        }
      )
    );
  }

  /**
   * 处理查询的参数
   */
  async dealQuery(params) {
    let query = {
      where: {},
      order: [["user_id", "ASC"]],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //根据id进行查询
    if (params.userId) {
      query.where.user_id = params.userId;
    }

    //查询用户类型（00系统用户）
    if (params.userType) {
      query.where.user_type = {
        [Op.eq]: params.userType,
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

    //查询帐号状态（0正常 1停用）
    if (params.status) {
      query.where.status = {
        [Op.eq]: params.status,
      };
    }

    //查询用户昵称
    if (params.nickName) {
      query.where.nick_name = {
        [Op.like]: `%${params.nickName}%`,
      };
    }

    //查询用户账号
    if (params.userName) {
      query.where.user_name = {
        [Op.like]: `%${params.userName}%`,
      };
    }

    //查询用户联系方式
    if (params.phonenumber) {
      query.where.phonenumber = {
        [Op.like]: `%${params.phonenumber}%`,
      };
    }

    //查询部门ID
    if (params.deptId) {
      let deptIds = await this.SysDept.findAll({
        where: {
          [Op.or]: [
            {
              dept_id: params.deptId,
            },
            {
              ancestors: {
                [Op.regexp]: `(^|,)${params.deptId}(,|$)`,
              },
            },
          ],
        },
      });
      deptIds = deptIds.map((item) => {
        return item.dataValues.dept_id;
      });
      query.where.dept_id = {
        [Op.in]: deptIds,
      };
    }

    return query;
  }
}

module.exports = SysUserService;
