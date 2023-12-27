/*
 * @Author: mark
 * @Date: 2023-06-24 22:41:35
 * @LastEditors: mark
 * @LastEditTime: 2023-09-01 06:58:09
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/model/sys_role_dept.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
/* indent size: 2 */

module.exports = (app) => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define(
    "sys_role_dept",
    {
      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "角色ID",
      },
      dept_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "部门ID",
      },
    },
    {
      tableName: "sys_role_dept",
      comment: "角色和部门关联表",
      //不自动记录时间
      timestamps: false,
    }
  );

  Model.associate = function () {
    app.model.SysRoleDept.hasOne(app.model.SysRole, {
      foreignKey: "role_id", //关联查询的字段
      sourceKey: "role_id",
    });

    app.model.SysRoleDept.hasOne(app.model.SysDept, {
      foreignKey: "dept_id", //关联查询的字段
      sourceKey: "dept_id",
    });
  };

  return Model;
};
