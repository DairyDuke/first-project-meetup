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
      // Group 1 will have 2 Events
      {
        venueId: 1,
        groupId: 1,
        name: "Burger Off",
        description: "Come join us for great food and fun at Burger Off 2022! Winning any Burgertember Edition Eating Contest will yield instant geek street cred AND a prize pack compliments of Hank Stine; My Hank 101. This act will tell you why burgers are king no matter what city you live in. Nothing lacks for taste and flavor than the burger flavor.",
        type: "In Person",
        capacity: 100,
        price: 10.00,
        startDate: "11/01/2022",
        endDate: "11/02/2022"
      },
      {
        venueId: 1,
        groupId: 1,
        name: "Cooking Class",
        description: "Learn to cook and enjoy great food. Grace Isaato wants to show everyone they can accomplish cooking. From careers exploring recipes using locally raised sustainable seasonings, educating them to write of family traditions at upcoming cooking books teaching them.",
        type: "In Person",
        capacity: 100,
        price: 10.00,
        startDate: "11/21/2022",
        endDate: "11/23/2022"
      },
      // Group 2 will have 1 Event
      {
        venueId: 2,
        groupId: 2,
        name: "Pizza Off",
        description: "Join us for Pizza Day 2018, from 8pm till 9pm from 5:00pm on Saturday 1 June 2018. A great and unique event that takes place each month between 5pm and 9pm. At 4pm each month, we will feature a pizza party at local restaurants. The night starts off with a pizza party, but we will be able to get up to 20 from the stage to create some great food! We will feature special orders and some delicious pizzas, along with a large selection of other food from around the city. The pizza party will be open from 8pm until the 3pm closing hours.",
        type: "In Person",
        capacity: 200,
        price: 20.00,
        startDate: "11/12/2022",
        endDate: "12/02/2022"
      },
      // Group 3 will have 2 Events
      {
        venueId: 3,
        groupId: 3,
        name: "Cake Off",
        description: "1 cup of fresh orange juice Instructions Place corn seeds into a large bowl and heat over medium-high heat until browned and slightly sweetened. In a large bowl, mix sweet corn seeds with coffee or tea. Place cinnamon in a bowl and whisk together dry and dried vanilla. Add in brown sugar and whisk. Stir in water, coffee or tea, and vanilla. Using a wooden spoon, beat mixture together. Add in the water mixture and beat with wooden spoon until it is completely smooth. Add in honey and then add in maple syrup and beat vigorously but no more. Continue, beating as needed. Add in sugar, corn syrup, and vanilla. (If you are using powdered sugar that has been reduced, you can add more powdered sugar to your recipe, but it could be better if you use the powdered sugar at the end of the recipe, then if you are using a food processor, add it in step (5-7) of Step 4 above) Place the corn seeds in freezer and cover until they are completely submerged, about 2 hours. Prepare cupcakes for frying by coating cupcakes with the corn",
        type: "Online",
        capacity: 300,
        price: 30.00,
        startDate: "11/03/2022",
        endDate: "12/03/2022"
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Pie Alchemy",
        description: "We also have the perfect recipe for giving an alchemist a good first drink or potion of some sort.        With the above in mind, we're very excited to announce that we'll be adding recipes to the beta and then releasing them on the client in the coming weeks. I'm very excited to have you in the beta as we've covered a wide range of the basics of your own Alchemy as well as a whole variety of other things here on Steam.        As with any good homebrew project, there are plenty of reasons why you want to try Alchemy (and it takes some practice) and we wish you an excellent followup! In all, we're excited to give what is one of our most exciting new additions an even more dedicated following, so check back shortly to see what we've got out! To stay on top of all related news and get to know Alchemy, we've put out over 50 free, open-source, monthly updates. We've all been doing this while, so this year it's a bit of a bit of a surprise that only a few of us have spent the past few months on the project. You can buy more information on our progress and updates (here and here), but those two posts, in which we discussed and discussed the latest open-source changes, provide a fairly comprehensive overview.",
        type: "Online",
        capacity: 300,
        price: 13.37,
        startDate: "12/01/2022",
        endDate: "12/03/2022"
      },
      // Group 4 will have no events
      // Group 5 will have 1 Event
      // {
      //   venueId: 5,
      //   groupId: 5,
      //   name: "Reading Marathon",
      //   description: "Vivamus vestibulum ipsum massa, id accumsan ipsum tristique ac. Integer vel est eu orci fermentum tristique et eu enim. Mauris scelerisque, lorem blandit tempor accumsan, dolor nisi auctor libero, ut dictum ligula elit et eros. Praesent faucibus libero vitae leo venenatis, eget pharetra neque ornare. Vestibulum nulla erat, porttitor vitae laoreet ut, congue eget metus. Nulla non sem porta, pellentesque metus sit amet, aliquet lacus. Sed at lacus mauris. Nulla id urna eu quam condimentum pellentesque vitae ac ligula. Cras vitae dui vel massa porta semper.",
      //   type: "Online",
      //   capacity: 300,
      //   price: 30.00,
      //   startDate: "11/03/2022",
      //   endDate: "12/03/2022"
      // }
    ]
    options.tableName = 'Events'
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
    options.tableName = 'Events'
    return queryInterface.bulkDelete(options, {
      // what to use to delete the above.
      name: { [Op.in]: ["Burger Off", "Cooking Class", "Pizza Off", "Cake Off", "Pie Alchemy", "Reading Marathon"] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
