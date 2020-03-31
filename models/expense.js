
module.exports = (sequelize, DataTypes) => {
  const expense = sequelize.define('expense', {
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    expensesType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING(300),
    },
  }, {});
  expense.associate = function (models) {
    // associations can be defined here
  };
  return expense;
};
