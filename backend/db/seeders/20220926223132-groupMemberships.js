'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //writing out bulk data in a variable for easy reference.
    const bulkData = [
      {
        userId: 1,
        groupId: 3,
        status: "Is member"
      },
      {
        userId: 2,
        groupId: 2,
        status: "Pending"
      },
      {
        userId: 3,
        groupId: 1,
        status: "Is member"
      }
    ]
    return queryInterface.bulkInsert('Memberships', bulkData, {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete('Memberships', {
      // what to use to delete the above.
      userId: { [Op.in]: [1, 2, 3] }

    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
