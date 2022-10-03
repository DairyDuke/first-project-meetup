'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //writing out bulk data in a variable for easy reference.
    const bulkData = [
      {
        eventId: 1,
        url: "www.picture.event.1",
        preview: true
      },
      {
        eventId: 2,
        url: "www.picture.event.2",
        preview: true
      },
      {
        eventId: 3,
        url: "www.picture.event.3",
        preview: false
      }
    ]
    return queryInterface.bulkInsert('EventImages', bulkData, {});
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
    return queryInterface.bulkDelete('EventImages', {
      // what to use to delete the above.
      eventId: { [Op.in]: [1, 2, 3] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
