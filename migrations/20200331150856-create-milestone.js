
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('milestones', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    tndId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'tnds',
        key: 'id',
      },
    },
    name: {
      type: Sequelize.STRING,
    },
    completedDate: {
      type: Sequelize.DATE,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('milestones'),
};
