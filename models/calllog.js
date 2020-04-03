
module.exports = (sequelize, DataTypes) => {
  const callLog = sequelize.define('callLog', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    contactPerson: {
      type: DataTypes.STRING,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,

    },
    notes: {
      type: DataTypes.TEXT,

    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,


    },
  }, {});
  callLog.associate = function (models) {
    callLog.belongsTo(models.user, {
      foreignKey: 'userId',
    });
  };
  return callLog;
};
