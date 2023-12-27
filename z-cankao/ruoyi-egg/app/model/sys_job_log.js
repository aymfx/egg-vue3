/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('sys_job_log', {
    job_log_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "任务日志ID",
      autoIncrement: true
    },
    job_name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "任务名称"
    },
    job_group: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: "任务组名"
    },
    invoke_target: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "调用目标字符串"
    },
    job_message: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "日志信息"
    },
    status: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      defaultValue: '0',
      comment: "执行状态（0正常 1失败）"
    },
    exception_info: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      defaultValue: '',
      comment: "异常信息"
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "创建时间"
    }
  }, {
    tableName: 'sys_job_log',
    comment:'定时任务调度日志表'
  });

  Model.associate = function() {

  }

  return Model;
};
