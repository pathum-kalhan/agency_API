
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'basicSal', { type: Sequelize.FLOAT }),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
