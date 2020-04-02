
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('tnds', 'completedPercentage', { type: Sequelize.INTEGER, defaultValue: 0 }),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
