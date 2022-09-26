'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //writing out bulk data in a variable for easy reference.
    const bulkData = [
      {
        venueId: 1,
        groupId: 2,
        name: "Burger Off",
        description: "This is the default description.",
        type: "TypeA",
        capacity: 100,
        price: 1000,
        startDate: "09/01/2022",
        endDate: "12/01/2022"
      },
      {
        venueId: 2,
        groupId: 1,
        name: "Pizza Off",
        description: "This is the default description.",
        type: "TypeB",
        capacity: 200,
        price: 2000,
        startDate: "09/02/2022",
        endDate: "12/02/2022"
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Cake Off",
        description: "This is the default description.",
        type: "TypeC",
        capacity: 300,
        price: 3000,
        startDate: "09/03/2022",
        endDate: "12/03/2022"
      }
    ]
    return queryInterface.bulkInsert('Events', bulkData, {});
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
    return queryInterface.bulkDelete('Events', {
      // what to use to delete the above.
      venueId: { [Op.in]: [1, 2, 3] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
