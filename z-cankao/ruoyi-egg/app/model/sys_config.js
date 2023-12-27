/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('sys_config', {
    config_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "参数主键",
      autoIncrement: true
    },
    config_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: '',
      comment: "参数名称"
    },
    config_key: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: '',
      comment: "参数键名"
    },
    config_value: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: '',
      comment: "参数键值"
    },
    config_type: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: 'N',
      comment: "系统内置（Y是 N否）"
    },
    create_by: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: '',
      comment: "创建者"
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "创建时间"
    },
    update_by: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: '',
      comment: "更新者"
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "更新时间"
    },
    remark: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "备注"
    }
  }, {
    tableName: 'sys_config',
    comment:'参数配置表'
  });

  Model.associate = function() {

  }

  return Model;
};
