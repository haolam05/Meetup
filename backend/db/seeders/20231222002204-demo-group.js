'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const { Group } = require('../models');

const emailToId = {
  'demo@user.io': 1,
  'user1@user.io': 2,
  'user2@user.io': 3
}

const groups = [
  {
    organizerId: emailToId['demo@user.io'],
    name: 'Morning Baseball on the Beach',
    about: 'Enjoy playing baseball with people with similar interest on the beautiful Alki beach',
    type: 'In person',
    private: false,
    city: 'Seattle',
    state: 'Washington',
    numMembers: 13,
    previewImage: 'https://images.pexels.com/photos/2444852/pexels-photo-2444852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    organizerId: emailToId['user1@user.io'],
    name: 'Video Games By Choice',
    about: 'Enjoy playing different type of video games every week with a passionate group of gamers',
    type: 'Online',
    private: true,
    city: 'Austin',
    state: 'Texas',
    numMembers: 5,
    previewImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    organizerId: emailToId['user1@user.io'],
    name: 'Creative Board Game',
    about: 'Enjoy playing various type of board games created by exclusive members every week',
    type: 'In person',
    private: false,
    city: 'San Francisco',
    state: 'California',
    numMembers: 30,
    previewImage: 'https://media.istockphoto.com/id/1076877918/photo/various-board-games-leisure-hobby-background-games.jpg?s=612x612&w=is&k=20&c=TqmsRqMTLh0IM-h3KVQRF1x7WWceoeUC2cON_Yu3UuU='
  },
  {
    organizerId: emailToId['user2@user.io'],
    name: 'Trending Animes',
    about: 'Enjoy watching the most trending animes every week with your fellow anime fans',
    type: 'In person',
    private: true,
    city: 'Nashville',
    state: 'Tennessee',
    numMembers: 8,
    previewImage: 'https://media.istockphoto.com/id/1271522601/photo/pop-corn-and-on-red-armchair-cinema.jpg?s=612x612&w=is&k=20&c=q7ATlUczSR1_l8KsA4IGsfmjrspy6cGdJT7TIYhG4Vc='
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Group.bulkCreate(groups, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    await queryInterface.bulkDelete(options, {
      name: [
        'Morning Baseball on the Beach',
        'Video Games By Choice',
        'Creative Board Game',
        'Trending Animes'
      ]
    });
  }
};
