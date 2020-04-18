
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('salaries', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: true,

    },
    allowance: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    salaryMonth: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    sal: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    basicSal: {
      type: Sequelize.FLOAT,
      allowNull: false,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('salaries'),
};
