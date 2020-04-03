
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('customers', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,

    },
    email: {
      type: Sequelize.STRING,
    },
    contactPerson: {
      type: Sequelize.STRING,
    },
    designation: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    notes: {
      type: Sequelize.STRING,
    },
    customerType: {
      type: Sequelize.STRING,
    },
    locality: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('customers'),
};
