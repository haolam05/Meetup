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
  'Trending Animes',
  'Basketball',
  'Soccer',
  'Golf',
  'Poker',
  'Karaoke',
  'Cooking',
  'Badminton',
  'Swimming'
];

const userEmails = [
  'demo@user.io',
  'user1@user.io',
  'user1@user.io',
  'user2@user.io',
  'user3@user.io',
  'user3@user.io',
  'user3@user.io',
  'user4@user.io',
  'user4@user.io',
  'user4@user.io',
  'user5@user.io',
  'user5@user.io'
];

const groups = [
  {
    name: groupNames[0],
    about: 'Enjoy playing volleyball with people with similar interest on the beautiful Alki beach',
    type: 'In person',
    private: false,
    city: 'Seattle',
    state: 'Washington'
  },
  {
    name: groupNames[1],
    about: 'Enjoy playing different type of video games every week with a passionate group of gamers',
    type: 'Online',
    private: true,
    city: 'Austin',
    state: 'Texas'
  },
  {
    name: groupNames[2],
    about: 'Enjoy playing various type of board games created by exclusive members every week',
    type: 'In person',
    private: true,
    city: 'San Francisco',
    state: 'California'
  },
  {
    name: groupNames[3],
    about: 'Enjoy watching the most trending animes every week with your fellow anime fans',
    type: 'Online',
    private: false,
    city: 'Nashville',
    state: 'Tennessee',
  },
  {
    name: groupNames[4],
    about: 'Enjoy playing basketball and practice your skills with others',
    type: 'In person',
    private: false,
    city: 'Seattle',
    state: 'Washington'
  },
  {
    name: groupNames[5],
    about: 'Enjoy playing soccer and improve your skills with others',
    type: 'In person',
    private: true,
    city: 'Bellevue',
    state: 'Washington'
  },
  {
    name: groupNames[6],
    about: 'Enjoy playing golf with others on a beautiful sunny day',
    type: 'In person',
    private: true,
    city: 'San Jose',
    state: 'California'
  },
  {
    name: groupNames[7],
    about: 'Enjoy playing poker games online with other poker lovers',
    type: 'Online',
    private: true,
    city: 'Seattle',
    state: 'Washington',
  },
  {
    name: groupNames[8],
    about: 'Enjoy singing and show off your skills with other "singers"',
    type: 'In person',
    private: false,
    city: 'Las Vegas',
    state: 'Nevada'
  },
  {
    name: groupNames[9],
    about: 'Enjoy sharing recipes and cooking a variety of dishes from different cultures',
    type: 'In person',
    private: false,
    city: 'Reno',
    state: 'Nevada'
  },
  {
    name: groupNames[10],
    about: 'Enjoy playing badminton with others and improve your skills through competing',
    type: 'In person',
    private: false,
    city: 'Henderson',
    state: 'Nevada'
  },
  {
    name: groupNames[11],
    about: 'Enjoy swimming with others and improve your swimming skills',
    type: 'In person',
    private: true,
    city: 'Edmonds',
    state: 'Washington',
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
