
module.exports = (sequelize, DataTypes) => {
  const leave = sequelize.define('leave', {

    leaveType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    leaveDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    isHalfDay: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    daysCount: { type: DataTypes.FLOAT },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
    notes: { type: DataTypes.TEXT },

  }, {});
  leave.associate = function (models) {
    // associations can be defined here
  };
  return leave;
};
