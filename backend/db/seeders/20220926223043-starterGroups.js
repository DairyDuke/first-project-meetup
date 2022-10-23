'use strict';

const bulkData = [
  {
    organizerId: 1,
    name: "Bobs Burgers",
    about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Iaculis nunc sed augue lacus. Placerat orci nulla pellentesque dignissim enim sit amet venenatis urna. Felis bibendum ut tristique et egestas quis ipsum. Nam aliquam sem et tortor consequat. Viverra nam libero justo laoreet. Interdum consectetur libero id faucibus nisl tincidunt eget nullam non. Quis lectus nulla at volutpat diam. Ultrices sagittis orci a scelerisque purus semper. Amet porttitor eget dolor morbi non arcu risus quis varius. Quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis. Commodo quis imperdiet massa tincidunt nunc pulvinar. Aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Eu mi bibendum neque egestas congue quisque egestas. Volutpat diam ut venenatis tellus in. Mi proin sed libero enim sed faucibus turpis in. Blandit massa enim nec dui nunc mattis enim.",
    type: "In Person",
    private: false,
    city: "Orlando",
    state: "FL"
  },
  {
    organizerId: 2,
    name: "Friends and Farmers",
    about: "Nisi quis eleifend quam adipiscing vitae. Iaculis urna id volutpat lacus. Praesent tristique magna sit amet purus. Lorem ipsum dolor sit amet consectetur. Maecenas pharetra convallis posuere morbi leo. Placerat vestibulum lectus mauris ultrices eros in cursus. Elementum sagittis vitae et leo duis ut diam quam. Sed velit dignissim sodales ut. Semper auctor neque vitae tempus quam pellentesque nec nam. Bibendum at varius vel pharetra vel turpis nunc eget lorem. Risus pretium quam vulputate dignissim suspendisse. Sed id semper risus in hendrerit gravida rutrum. Fusce ut placerat orci nulla pellentesque dignissim enim sit. Dictum at tempor commodo ullamcorper. Vitae proin sagittis nisl rhoncus mattis rhoncus urna neque.",
    type: "Online",
    private: true,
    city: "Miami",
    state: "FL"
  },
  {
    organizerId: 3,
    name: "Programers Anon",
    about: "Arcu odio ut sem nulla. Sapien eget mi proin sed libero enim. Tortor at auctor urna nunc id cursus metus aliquam. Tincidunt arcu non sodales neque sodales ut. Sit amet tellus cras adipiscing. Etiam erat velit scelerisque in dictum. Purus in mollis nunc sed id semper risus in hendrerit. Felis donec et odio pellentesque diam. Sollicitudin tempor id eu nisl. Lacinia at quis risus sed vulputate odio. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Ultricies lacus sed turpis tincidunt. Ipsum a arcu cursus vitae congue mauris rhoncus. Donec adipiscing tristique risus nec feugiat. Id donec ultrices tincidunt arcu non sodales neque. Dignissim diam quis enim lobortis scelerisque fermentum dui. Elementum integer enim neque volutpat ac. Mauris ultrices eros in cursus turpis massa. Vitae semper quis lectus nulla at volutpat diam ut venenatis. Amet nulla facilisi morbi tempus.",
    type: "Online",
    private: false,
    city: "Ape City",
    state: "FL"
  },
  {
    organizerId: 4,
    name: "Clever Group Name",
    about: "Tincidunt vitae semper quis lectus nulla. Pellentesque elit eget gravida cum sociis natoque penatibus. Amet risus nullam eget felis eget nunc lobortis mattis. Imperdiet proin fermentum leo vel orci. Varius morbi enim nunc faucibus a. A pellentesque sit amet porttitor eget dolor morbi non arcu. Cursus metus aliquam eleifend mi in nulla posuere sollicitudin aliquam. Duis tristique sollicitudin nibh sit. In iaculis nunc sed augue lacus viverra. Pellentesque id nibh tortor id. Cursus eget nunc scelerisque viverra.",
    type: "Online",
    private: false,
    city: "New Kansas",
    state: "AZ"
  },
  {
    organizerId: 5,
    name: "Book Readers",
    about: "Donec adipiscing tristique risus nec feugiat in fermentum posuere. Sit amet luctus venenatis lectus magna fringilla urna. Egestas maecenas pharetra convallis posuere morbi leo urna. Erat pellentesque adipiscing commodo elit. Tincidunt dui ut ornare lectus sit amet est placerat. Donec massa sapien faucibus et molestie ac. Volutpat odio facilisis mauris sit. Tempus iaculis urna id volutpat. Facilisis volutpat est velit egestas dui. Pretium lectus quam id leo. Sed sed risus pretium quam. Et malesuada fames ac turpis egestas sed tempus urna et. Euismod quis viverra nibh cras. Mattis pellentesque id nibh tortor id.    Ultrices in iaculis nunc sed augue lacus viverra vitae. Sapien eget mi proin sed libero enim sed faucibus turpis. Sed odio morbi quis commodo odio aenean sed. Leo duis ut diam quam nulla. Aliquet risus feugiat in ante metus dictum at tempor. Elementum integer enim neque volutpat ac tincidunt. Enim diam vulputate ut pharetra sit amet aliquam id diam. Elementum sagittis vitae et leo duis. Quisque sagittis purus sit amet volutpat consequat. Egestas purus viverra accumsan in nisl nisi scelerisque eu. Quam viverra orci sagittis eu. Suspendisse interdum consectetur libero id faucibus nisl. Mauris a diam maecenas sed enim ut. Condimentum id venenatis a condimentum vitae.",
    type: "Online",
    private: false,
    city: "Charlotte",
    state: "MO"
  }
]
module.exports = {
  up: async (queryInterface, Sequelize) => {
    //writing out bulk data in a variable for easy reference.
    return queryInterface.bulkInsert('Groups', bulkData, {});
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

    // what to use to delete the above.
    return queryInterface.bulkDelete('Groups', {
      // what to use to delete the above.
      organizerId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
