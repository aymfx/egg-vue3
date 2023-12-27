const Service = require("egg").Service;
const { Op } = require("sequelize");
class SysRoleService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SysRole = ctx.model.SysRole;
    this.SysRoleDept = ctx.model.SysRoleDept;
    this.SysUserRole = ctx.model.SysUserRole;
    this.SysDept = ctx.model.SysDept;
    this.SysUser = ctx.model.SysUser;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.objUnderlineToHump = ctx.objUnderlineToHump;
    this.objHumpToUnderline = ctx.objHumpToUnderline;
    this.toInt = ctx.toInt;
    this.userName =
      ctx.handleUser && ctx.handleUser.userName ? ctx.handleUser.userName : "";
    this.changeToTree = ctx.changeToTree;
  }

  /**
   * 分页查询
   * @param {*} params
   */
  async list(params) {
    let select = params.pageSize ? 1 : 0;
    params = this.dealQuery(params);
    let data;
    data = await this.SysRole.findAndCountAll(
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
    data = await this.SysRole.findAndCountAll(
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
    const findRepeat = await this.SysRole.findOne({
      where: {
        [Op.or]: [
          {
            role_name: params.roleName,
          },
        ],
      },
    });
    if (findRepeat) {
      return this.ServerResponse.createByErrorCodeMsgBusiness(10011);
    } else {
      let res = await this.SysRole.create(
        Object.assign(
          {
            create_time: new Date(),
            update_time: new Date(),
          },
          this.objHumpToUnderline(params)
        )
      );
      //添加菜单
      let roleId = res.dataValues.role_id;
      //查询所有的权限及菜单
      let menuList = await this.SysMenu.findAll({
        where: {
          [Op.or]: [
            {
              menu_id: {
                [Op.in]: params.menuIds,
              },
            },
            {
              parent_id: {
                [Op.in]: params.menuIds,
              },
            },
          ],
        },
      });
      menuList = menuList.map((item) => {
        return {
          role_id: roleId,
          menu_id: item.dataValues.menu_id,
        };
      });
      //添加新的权限对应菜单数据
      await this.SysRoleMenu.bulkCreate(menuList);

      //添加数据权限
      let addMap = [];
      params.deptIds.forEach((element) => {
        addMap.push({
          dept_id: element,
          role_id: roleId,
        });
      });
      //添加新的权限对应部门数据
      await this.SysRoleDept.bulkCreate(addMap);
      return this.ServerResponse.createBySuccessMsg("新增成功");
    }
  }

  /**
   * 删除
   * @param {*} params
   */
  async delete(roleId) {
    let ids = roleId.split(",");
    await this.SysRole.destroy({
      where: {
        role_id: {
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
    const findRepeat = await this.SysRole.findByPk(params.roleId);
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
      if (params.deptIds) {
        //删除原始的权限对应部门数据
        await this.SysRoleDept.destroy(params.roleId + "");
        let addMap = [];
        params.deptIds.forEach((element) => {
          addMap.push({
            dept_id: element,
            role_id: params.roleId,
          });
        });
        //添加新的权限对应部门数据
        await this.SysRoleDept.bulkCreate(addMap);
      }

      if (params.menuIds) {
        //删除原始的权限对应菜单数据
        await this.SysRoleMenu.destroy(params.roleId + "");
        let addMap = [];
        params.menuIds.forEach((element) => {
          addMap.push({
            menu_id: element,
            role_id: params.roleId,
          });
        });
        //查询所有的权限及菜单
        let menuList = await this.SysMenu.findAll({
          where: {
            [Op.or]: [
              {
                menu_id: {
                  [Op.in]: params.menuIds,
                },
              },
              {
                parent_id: {
                  [Op.in]: params.menuIds,
                },
              },
            ],
          },
        });
        menuList = menuList.map((item) => {
          return {
            role_id: params.roleId,
            menu_id: item.dataValues.menu_id,
          };
        });
        //添加新的权限对应菜单数据
        await this.SysRoleMenu.bulkCreate(menuList);
      }

      return this.ServerResponse.createBySuccessMsg(msg || "修改成功");
    }
  }

  /**
   * 获取详情
   * @param {*} roleId
   */
  async detail(roleId) {
    let data = await this.SysRole.findByPk(roleId);
    data = this.objUnderlineToHump(data.dataValues);
    return this.ServerResponse.createBySuccessData(data);
  }

  /**
   * 查询权限所在部门
   */
  async getIdRole(params) {
    let roleId = params.roleId;
    let checkedKeys = await this.SysRoleDept.findAll({
      where: {
        role_id: roleId,
      },
      include: [{ model: this.SysDept }],
    });
    //全部父元素的id
    let allParentId = [];
    checkedKeys = checkedKeys.map((item) => {
      let ancestors = item.sys_dept.dataValues.ancestors.split(",");
      ancestors = ancestors.map((item) => {
        return parseInt(item);
      });
      allParentId = allParentId.concat(ancestors);
      item = Object.assign(this.objUnderlineToHump(item.dataValues), {
        sysDepts: this.objUnderlineToHump(item.sys_dept.dataValues),
      });
      return item;
    });
    allParentId = [...new Set(allParentId)];

    checkedKeys = checkedKeys.map((item) => {
      if (allParentId.indexOf(item.deptId) == -1) {
        return item.deptId;
      }
    });
    checkedKeys = checkedKeys.filter((item) => item);
    let depts = await this.ctx.service.system.sysDept.allList({
      status: "0",
    });

    depts = depts.data.map((item) => {
      return {
        id: item.deptId,
        parentId: item.parentId,
        label: item.deptName,
      };
    });
    depts = this.changeToTree(depts);
    return this.ServerResponse.createBySuccessMsgAndData("请求成功", null, {
      depts,
      checkedKeys,
    });
  }

  /**
   * 查询角色下的所有用户
   * @param {*} params
   * @param {*} type 类型  allocatedList代表授权的用户  unallocatedList代表未授权的用户
   * @returns
   */
  async allocatedList(params, type) {
    let query;
    let data;
    if (type == "allocatedList") {
      query = await this.dealQueryUser(params, type);
      data = await this.SysUser.findAndCountAll(query);
    } else {
      data = await this.unAllocatedList(
        params.pageNum,
        params.pageSize,
        params.roleId
      );
    }

    let total = data.count;
    let rows = data.rows.map((item) => {
      return this.objUnderlineToHump(item.dataValues);
    });
    return this.ServerResponse.createBySuccessMsgAndData(
      "请求成功",
      {},
      {
        rows,
        total,
      }
    );
  }

  /**
   * 查询用户数据
   * @param {*} params
   * @param {*} type 表示查询属于该权限下的还是不属于该权限下的  1表示在权限下  2表示不在权限下
   * @returns
   */
  async dealQueryUser(params, type = "allocatedList") {
    let query = {
      where: {},
      order: [["user_id", "ASC"]],
      include: [
        {
          model: this.SysUserRole,
          where: {},
          required: true,
        },
      ],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //根据用户角色查询
    if (type == "allocatedList") {
      query.include[0].where.role_id = params.roleId;
    }

    //查询用户名
    if (params.userName) {
      query.where.user_name = {
        [Op.like]: `%${params.userName}%`,
      };
    }

    //查询手机号码
    if (params.phonenumber) {
      query.where.phonenumber = {
        [Op.like]: `%${params.phonenumber}%`,
      };
    }
    return query;
  }

  /**
   * 处理查询的参数
   */
  dealQuery(params) {
    let query = {
      where: {},
      order: [["role_id", "ASC"]],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //根据id进行查询
    if (params.roleId) {
      query.where.role_id = params.roleId;
    }

    //查询角色状态（0正常 1停用）
    if (params.status) {
      query.where.status = {
        [Op.eq]: params.status,
      };
    }

    //查询角色名称
    if (params.roleName) {
      query.where.role_name = {
        [Op.like]: `%${params.roleName}%`,
      };
    }

    //查询角色权限字符串
    if (params.roleKey) {
      query.where.role_key = {
        [Op.like]: `%${params.roleKey}%`,
      };
    }

    //查询角色ID
    if (params.roleId) {
      query.where.role_id = {
        [Op.eq]: params.roleId,
      };
    }

    //查询创建时间
    if (params["params[createTimeStart]"]) {
      query.where.create_time = {
        [Op.eq]: [
          params["params[createTimeStart]"],
          params["params[createTimeEnd]"],
        ],
      };
    }

    return query;
  }
  /**
   * 查询所有未授权过该权限的用户
   * @param {*} page 分页参数
   * @param {*} pageSize 分页参数
   * @param {*} roleId 权限的id
   * @returns
   */
  async unAllocatedList(page, pageSize, roleId) {
    let allUserRole = await this.SysUserRole.findAll({
      where: {
        role_id: roleId,
      },
    });
    allUserRole = allUserRole.map((item) => {
      return item.dataValues.user_id;
    });
    allUserRole = [...new Set(allUserRole)];

    return await this.SysUser.findAndCountAll({
      limit: this.toInt(pageSize),
      offset: (this.toInt(page) - 1) * this.toInt(pageSize),
      where: {
        user_id: {
          [Op.notIn]: allUserRole,
        },
      },
    });
  }
}

module.exports = SysRoleService;
