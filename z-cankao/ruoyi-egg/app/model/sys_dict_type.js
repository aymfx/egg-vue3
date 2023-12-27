/* indent size: 2 */

module.exports = (app) => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define(
    "sys_dict_type",
    {
      dict_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "字典主键",
        autoIncrement: true,
      },
      dict_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "",
        comment: "字典名称",
      },
      dict_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "",
        comment: "字典类型",
        unique: true,
      },
      status: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        defaultValue: "0",
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
      tableName: "sys_dict_type",
      comment: "字典类型表",
    }
  );

  Model.associate = function () {};

  return Model;
};
