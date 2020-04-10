
module.exports = (sequelize, DataTypes) => {
  const customer = sequelize.define('customer', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    email: {
      type: DataTypes.STRING,
    },
    contactPerson: {
      type: DataTypes.STRING,
    },
    designation: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.STRING,
    },
    customerType: {
      type: DataTypes.STRING,
    },
    locality: {
      type: DataTypes.STRING,
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {});
  customer.associate = function (models) {
    // associations can be defined here
  };
  return customer;
};
