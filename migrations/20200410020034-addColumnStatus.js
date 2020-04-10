
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('customers', 'status', { type: Sequelize.BOOLEAN, defaultValue: true }),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
