'use strict';

// NEW: add this code to each migration file
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
// END of new code

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //writing out bulk data in a variable for easy reference.
    const bulkData = [
      //6
      {
        eventId: 1,
        url: "/images/defaultEventImage.png",
        preview: true
      },
      {
        eventId: 2,
        url: "/images/datingGroup.png",
        preview: true
      },
      {
        eventId: 3,
        url: "/images/aquaGroup.jpeg",
        preview: true
      },
      {
        eventId: 4,
        url: "/images/meetGroup.png",
        preview: true
      },
      {
        eventId: 5,
        url: "/images/taxesGroup.png",
        preview: true
      }
      // {
      //   eventId: 6,
      //   url: "/defaultEventImage.png",
      //   preview: true
      // }
    ]
    options.tableName = 'EventImages'
    return queryInterface.bulkInsert(options, bulkData, {});
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
    options.tableName = 'EventImages'
    return queryInterface.bulkDelete(options, {
      // what to use to delete the above.
      eventId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
