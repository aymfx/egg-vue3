/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('sys_role_menu', {
    role_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "角色ID"
    },
    menu_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "菜单ID"
    }
  }, {
    tableName: 'sys_role_menu',
    comment:'角色和菜单关联表'
  });

  Model.associate = function() {

  }

  return Model;
};
