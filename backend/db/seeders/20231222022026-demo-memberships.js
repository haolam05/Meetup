'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const { Group, User, Membership } = require('../models');

const groupNames = [
  'Trending Animes',
  'Creative Board Game',
  'Video Games By Choice',
  'Morning Volleyball on the Beach',
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
  'luffy@user.io',
  'zoro@user.io',
  'sanji@user.io',
  'ace@user.io',
  'robin@user.io',
  'chopper@user.io',
  'mihawk@user.io'
];

const status = [
  'pending',
  'member',
  'co-host'
]

const memberships = [
  {
    userEmail: userEmails[0],
    groupName: groupNames[0],
    status: status[2]
  },
  {
    userEmail: userEmails[0],
    groupName: groupNames[1],
    status: status[2]
  },
  {
    userEmail: userEmails[0],
    groupName: groupNames[2],
    status: status[1]
  },
  {
    userEmail: userEmails[1],
    groupName: groupNames[0],
    status: status[1]
  },
  {
    userEmail: userEmails[1],
    groupName: groupNames[3],
    status: status[1]
  },
  {
    userEmail: userEmails[2],
    groupName: groupNames[2],
    status: status[2]
  },
  {
    userEmail: userEmails[2],
    groupName: groupNames[3],
    status: status[2]
  },
  {
    userEmail: userEmails[2],
    groupName: groupNames[1],
    status: status[0]
  },
  {
    userEmail: userEmails[3],
    groupName: groupNames[10],
    status: status[1]
  },
  {
    userEmail: userEmails[3],
    groupName: groupNames[11],
    status: status[0]
  },
  {
    userEmail: userEmails[4],
    groupName: groupNames[5],
    status: status[1]
  },
  {
    userEmail: userEmails[4],
    groupName: groupNames[1],
    status: status[1]
  },
  {
    userEmail: userEmails[4],
    groupName: groupNames[6],
    status: status[1]
  },
  {
    userEmail: userEmails[5],
    groupName: groupNames[4],
    status: status[0]
  },
  {
    userEmail: userEmails[5],
    groupName: groupNames[5],
    status: status[2]
  },
  {
    userEmail: userEmails[5],
    groupName: groupNames[6],
    status: status[0]
  },
  {
    userEmail: userEmails[6],
    groupName: groupNames[1],
    status: status[0]
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (let i = 0; i < memberships.length; i++) {
      const membership = memberships[i];
      const userEmail = membership.userEmail;
      const groupName = membership.groupName;
      const user = await User.findOne({ where: { email: userEmail } });
      const group = await Group.findOne({ where: { name: groupName } });
      membership.userId = user.id;
      membership.groupId = group.id;
    }
    await Membership.bulkCreate(memberships, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    await queryInterface.bulkDelete(options, { status });
  }
};
