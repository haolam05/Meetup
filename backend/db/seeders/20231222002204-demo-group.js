'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const { Group, User } = require('../models');

const groupNames = [
  'Morning Volleyball on the Beach',
  'Video Games By Choice',
  'Creative Board Game',
  'Trending Animes'
];

const userEmails = [
  'demo@user.io',
  'user1@user.io',
  'user1@user.io',
  'user2@user.io'
];

const groups = [
  {
    name: groupNames[0],
    about: 'Enjoy playing volleyball with people with similar interest on the beautiful Alki beach',
    type: 'In person',
    private: false,
    city: 'Seattle',
    state: 'Washington',
    numMembers: 13,
    previewImage: 'https://images.pexels.com/photos/2444852/pexels-photo-2444852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    name: groupNames[1],
    about: 'Enjoy playing different type of video games every week with a passionate group of gamers',
    type: 'Online',
    private: true,
    city: 'Austin',
    state: 'Texas',
    numMembers: 5,
    previewImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    name: groupNames[2],
    about: 'Enjoy playing various type of board games created by exclusive members every week',
    type: 'In person',
    private: true,
    city: 'San Francisco',
    state: 'California',
    numMembers: 30,
    previewImage: 'https://media.istockphoto.com/id/1076877918/photo/various-board-games-leisure-hobby-background-games.jpg?s=612x612&w=is&k=20&c=TqmsRqMTLh0IM-h3KVQRF1x7WWceoeUC2cON_Yu3UuU='
  },
  {
    name: groupNames[3],
    about: 'Enjoy watching the most trending animes every week with your fellow anime fans',
    type: 'In person',
    private: false,
    city: 'Nashville',
    state: 'Tennessee',
    numMembers: 8,
    previewImage: 'https://media.istockphoto.com/id/1271522601/photo/pop-corn-and-on-red-armchair-cinema.jpg?s=612x612&w=is&k=20&c=q7ATlUczSR1_l8KsA4IGsfmjrspy6cGdJT7TIYhG4Vc='
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const email = userEmails[i];
      const user = await User.findOne({ where: { email } });
      group.organizerId = user.id;
    }
    await Group.bulkCreate(groups, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    await queryInterface.bulkDelete(options, { name: groupNames });
  }
};
