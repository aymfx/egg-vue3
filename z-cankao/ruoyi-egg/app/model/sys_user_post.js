/*
 * @Author: mark
 * @Date: 2023-06-24 22:41:35
 * @LastEditors: mark
 * @LastEditTime: 2023-09-03 17:55:21
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/model/sys_user_post.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
/* indent size: 2 */

module.exports = (app) => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define(
    "sys_user_post",
    {
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "用户ID",
      },
      post_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "岗位ID",
      },
    },
    {
      tableName: "sys_user_post",
      comment: "用户与岗位关联表",
      //不自动记录时间
      timestamps: false,
    }
  );

  Model.associate = function () {
    app.model.SysUserPost.belongsTo(app.model.SysUser, {
      foreignKey: "user_id",
    });
    app.model.SysUserPost.belongsTo(app.model.SysPost, {
      foreignKey: "post_id",
    });
  };

  return Model;
};
