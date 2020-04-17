
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('users', 'isPermanent', { type: Sequelize.BOOLEAN, defaultValue: false }),
    queryInterface.addColumn('users', 'joinedDate', { type: Sequelize.DATEONLY, defaultValue: null }),
    queryInterface.addColumn('leaves', 'status', { type: Sequelize.BOOLEAN, defaultValue: true }),
    queryInterface.addColumn('leaves', 'notes', { type: Sequelize.TEXT }),

  ]),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
