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
    type: 'In person',
    private: false,
    city: 'Nashville',
    state: 'Tennessee',
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
