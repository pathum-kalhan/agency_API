const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const tnd = sequelize.define('tnd', {
    userId: {
      type: DataTypes.INTEGER,

    },
    timePeriod: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING(300),
    },
    investment: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    completedPercentage: { type: DataTypes.INTEGER, defaultValue: 0 },
    deadlineDate: {
      type: DataTypes.VIRTUAL,
      get() {
        const d = moment(this.getDataValue('deadline')).format('YYYY-MM-DD hh:mm:ss A');
        return d;
      },
    },
  }, {});
  tnd.associate = function (models) {
    tnd.belongsTo(models.user, {
      foreignKey: 'userId',
    });
  };
  return tnd;
};
