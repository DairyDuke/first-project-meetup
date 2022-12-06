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
      {
        groupId: 1,
        address: "123 BackAlley RD",
        city: "Hoboken",
        state: "NJ",
        lat: 12.4965461,
        lng: 32.1478569,
      },
      {
        groupId: 2,
        address: "1 Google Way",
        city: "GoogleVille",
        state: "WA",
        lat: 34.3685412,
        lng: -12.7845489,
      },
      {
        groupId: 3,
        address: "5323 Bakers DR.",
        city: "Ape",
        state: "KA",
        lat: 72.7852369,
        lng: 442.1254789,
      },
      {
        groupId: 5,
        address: "1 Prior DR.",
        city: "Kansas",
        state: "AR",
        lat: 72.7852369,
        lng: 442.1254789,
      }
    ]
    options.tableName = 'Venues'
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

    options.tableName = 'Venues'
    return queryInterface.bulkDelete(options, {
      // what to use to delete the above.
      groupId: { [Op.in]: [1, 2, 3, 5] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
