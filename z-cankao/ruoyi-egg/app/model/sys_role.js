/* indent size: 2 */

module.exports = (app) => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define(
    "sys_role",
    {
      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "角色ID",
        autoIncrement: true,
      },
      role_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        comment: "角色名称",
      },
      role_key: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "角色权限字符串",
      },
      role_sort: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "显示顺序",
      },
      data_scope: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: "1",
        comment:
          "数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）",
      },
      menu_check_strictly: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        defaultValue: "1",
        comment: "菜单树选择项是否关联显示",
      },
      dept_check_strictly: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        defaultValue: "1",
        comment: "部门树选择项是否关联显示",
      },
      status: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        comment: "角色状态（0正常 1停用）",
      },
      del_flag: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: "0",
        comment: "删除标志（0代表存在 2代表删除）",
      },
      create_by: {
        type: DataTypes.STRING(64),
        allowNull: true,
        defaultValue: "",
        comment: "创建者",
      },
      create_time: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "创建时间",
      },
      update_by: {
        type: DataTypes.STRING(64),
        allowNull: true,
        defaultValue: "",
        comment: "更新者",
      },
      update_time: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "更新时间",
      },
      remark: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: "备注",
      },
    },
    {
      tableName: "sys_role",
      comment: "角色信息表",
    }
  );

  Model.associate = function () {
    app.model.SysRole.belongsToMany(app.model.SysUser, {
      through: app.model.SysUserRole,
      foreignKey: "role_id",
    });
  };

  return Model;
};
