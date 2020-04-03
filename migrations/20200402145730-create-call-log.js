
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('callLogs', {
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
    },
    contactPerson: {
      type: Sequelize.STRING,
    },
    company: {
      type: Sequelize.STRING,
      allowNull: false,

    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,

    },
    notes: {
      type: Sequelize.TEXT,

    },
    status: {
      type: Sequelize.STRING,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('callLogs'),
};
