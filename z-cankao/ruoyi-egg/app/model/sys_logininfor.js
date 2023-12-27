/*
 * @Author: mark
 * @Date: 2023-06-24 22:41:35
 * @LastEditors: mark
 * @LastEditTime: 2023-08-13 16:59:28
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/model/sys_logininfor.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
/* indent size: 2 */

module.exports = (app) => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define(
    "sys_logininfor",
    {
      info_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "访问ID",
        autoIncrement: true,
      },
      user_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "",
        comment: "用户账号",
      },
      ipaddr: {
        type: DataTypes.STRING(128),
        allowNull: true,
        defaultValue: "",
        comment: "登录IP地址",
      },
      login_location: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
        comment: "登录地点",
      },
      browser: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "",
        comment: "浏览器类型",
      },
      os: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "",
        comment: "操作系统",
      },
      status: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: "0",
        comment: "登录状态（0成功 1失败）",
      },
      msg: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
        comment: "提示消息",
      },
      login_time: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "访问时间",
      },
    },
    {
      tableName: "sys_logininfor",
      comment: "系统访问记录",
      //不自动记录时间戳
      timestamps: false,
    }
  );

  Model.associate = function () {};

  return Model;
};
