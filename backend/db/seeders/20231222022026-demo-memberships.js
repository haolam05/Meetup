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
  'Morning Baseball on the Beach'
];

const userEmails = [
  'demo@user.io',
  'user1@user.io',
  'user2@user.io'
];
// 'co-host', 'member', 'pending
const memberships = [
  {
    userEmail: userEmails[0],
    groupName: groupNames[0],
    status: 'co-host'
  },
  {
    userEmail: userEmails[0],
    groupName: groupNames[1],
    status: 'co-host'
  },
  {
    userEmail: userEmails[0],
    groupName: groupNames[2],
    status: 'member'
  },
  {
    userEmail: userEmails[0],
    groupName: groupNames[3],
    status: 'pending'
  },
  {
    userEmail: userEmails[1],
    groupName: groupNames[0],
    status: 'member'
  },
  {
    userEmail: userEmails[1],
    groupName: groupNames[3],
    status: 'member'
  },
  {
    userEmail: userEmails[2],
    groupName: groupNames[2],
    status: 'co-host'
  },
  {
    userEmail: userEmails[2],
    groupName: groupNames[3],
    status: 'co-host'
  },
  {
    userEmail: userEmails[2],
    groupName: groupNames[1],
    status: 'pending'
  },
  {
    userEmail: userEmails[2],
    groupName: groupNames[0],
    status: 'member'
  },
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
    const users = await Promise.all(userEmails.map(email => User.findOne({ where: { email } })));
    const userIds = users.map(user => user.id);
    options.tableName = 'Memberships';
    await queryInterface.bulkDelete(options, { userId: userIds });
  }
};
