/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('sys_dept', {
    dept_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "部门id",
      autoIncrement: true
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0',
      comment: "父部门id"
    },
    ancestors: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: '',
      comment: "祖级列表"
    },
    dept_name: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: '',
      comment: "部门名称"
    },
    order_num: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0',
      comment: "显示顺序"
    },
    leader: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "负责人"
    },
    phone: {
      type: DataTypes.STRING(11),
      allowNull: true,
      comment: "联系电话"
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "邮箱"
    },
    status: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: '0',
      comment: "部门状态（0正常 1停用）"
    },
    del_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: '0',
      comment: "删除标志（0代表存在 2代表删除）"
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
    }
  }, {
    tableName: 'sys_dept',
    comment:'部门表'
  });

  Model.associate = function() {

  }

  return Model;
};
