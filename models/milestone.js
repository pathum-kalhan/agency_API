
module.exports = (sequelize, DataTypes) => {
  const milestone = sequelize.define('milestone', {
    tndId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tnds',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
    },
    completedDate: {
      type: DataTypes.DATE,
    },
  }, {});
  milestone.associate = function (models) {
    // associations can be defined here
  };
  return milestone;
};
