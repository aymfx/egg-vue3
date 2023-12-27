/*
 * @Author: mark
 * @Date: 2023-06-24 22:41:35
 * @LastEditors: mark
 * @LastEditTime: 2023-09-03 17:58:53
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/model/sys_post.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
/* indent size: 2 */

module.exports = (app) => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define(
    "sys_post",
    {
      post_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "岗位ID",
        autoIncrement: true,
      },
      post_code: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: "岗位编码",
      },
      post_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "岗位名称",
      },
      post_sort: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "显示顺序",
      },
      status: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        comment: "状态（0正常 1停用）",
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
      tableName: "sys_post",
      comment: "岗位信息表",
    }
  );

  Model.associate = function () {
    app.model.SysPost.belongsToMany(app.model.SysUser, {
      through: app.model.SysUserPost,
      foreignKey: "post_id",
    });
  };

  return Model;
};
