/*
 * @Author: mark
 * @Date: 2023-06-24 22:41:35
 * @LastEditors: mark
 * @LastEditTime: 2023-08-14 10:33:11
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/model/sys_user_role.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
/* indent size: 2 */

module.exports = (app) => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define(
    "sys_user_role",
    {
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "用户ID",
      },
      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "角色ID",
      },
    },
    {
      tableName: "sys_user_role",
      comment: "用户和角色关联表",
      //不自动记录时间
      timestamps: false,
    }
  );

  Model.associate = function () {
    app.model.SysUserRole.belongsTo(app.model.SysUser, {
      foreignKey: "user_id",
    });
    app.model.SysUserRole.belongsTo(app.model.SysRole, {
      foreignKey: "role_id",
    });
  };

  return Model;
};
