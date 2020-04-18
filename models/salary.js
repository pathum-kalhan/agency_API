
module.exports = (sequelize, DataTypes) => {
  const salary = sequelize.define('salary', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: true,

    },
    allowance: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    salaryMonth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    basicSal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {});
  salary.associate = function (models) {
    salary.belongsTo(models.user, {
      foreignKey: 'userId',
    });
  };
  return salary;
};
