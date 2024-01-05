'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const userNames = [
  'Demo-lition',
  'FakeUser1',
  'FakeUser2',
  'FakeUser3',
  'FakeUser4',
  'FakeUser5',
  'FakeUser6'
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: userNames[0],
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Demo',
        lastName: 'Lition'
      },
      {
        email: 'user1@user.io',
        username: userNames[1],
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Fake',
        lastName: 'User1'
      },
      {
        email: 'user2@user.io',
        username: userNames[2],
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Fake',
        lastName: 'User2'
      },
      {
        email: 'user3@user.io',
        username: userNames[3],
        hashedPassword: bcrypt.hashSync('password4'),
        firstName: 'Fake',
        lastName: 'User3'
      },
      {
        email: 'user4@user.io',
        username: userNames[4],
        hashedPassword: bcrypt.hashSync('password5'),
        firstName: 'Fake',
        lastName: 'User4'
      },
      {
        email: 'user5@user.io',
        username: userNames[5],
        hashedPassword: bcrypt.hashSync('password6'),
        firstName: 'Fake',
        lastName: 'User5'
      },
      {
        email: 'user6@user.io',
        username: userNames[6],
        hashedPassword: bcrypt.hashSync('password7'),
        firstName: 'Fake',
        lastName: 'User6'
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.bulkDelete(options, { username: userNames });
  }
};
