'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const userNames = [
  'monkey-luffy',
  'roronoa-zoro',
  'vinsmoke-sanji',
  'portgas-ace',
  'nico-robin',
  'tony-chopper',
  'dracule-mihawk'
];


const emails = [
  'luffy@user.io',
  'zoro@user.io',
  'sanji@user.io',
  'ace@user.io',
  'robin@user.io',
  'chopper@user.io',
  'mihawk@user.io',
]

const location = 'https://meetup2024.s3.us-west-2.amazonaws.com/public/';

const profileImageUrls = [
  location + 'luffy-avatar.png',
  location + 'zoro-avatar.jpg',
  location + 'sanji-avatar.png',
  location + 'ace-avatar.png',
  location + 'robin-avatar.jpg',
  location + 'chopper-avatar.png',
  location + 'mihawk-avatar.png'
]

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: emails[0],
        username: userNames[0],
        hashedPassword: bcrypt.hashSync('luffyPassword'),
        firstName: 'Luffy',
        lastName: 'Monkey D.',
        profileImageUrl: profileImageUrls[0]
      },
      {
        email: emails[1],
        username: userNames[1],
        hashedPassword: bcrypt.hashSync('zoroPassword'),
        firstName: 'Zoro',
        lastName: 'Roronoa',
        profileImageUrl: profileImageUrls[1]
      },
      {
        email: emails[2],
        username: userNames[2],
        hashedPassword: bcrypt.hashSync('sanjiPassword'),
        firstName: 'Sanji',
        lastName: 'Vinsmoke',
        profileImageUrl: profileImageUrls[2]
      },
      {
        email: emails[3],
        username: userNames[3],
        hashedPassword: bcrypt.hashSync('acePassword'),
        firstName: 'Ace',
        lastName: 'Portgas D.',
        profileImageUrl: profileImageUrls[3]
      },
      {
        email: emails[4],
        username: userNames[4],
        hashedPassword: bcrypt.hashSync('robinPassword'),
        firstName: 'Robin',
        lastName: 'Nico',
        profileImageUrl: profileImageUrls[4]
      },
      {
        email: emails[5],
        username: userNames[5],
        hashedPassword: bcrypt.hashSync('chopperPassword'),
        firstName: 'Chopper',
        lastName: 'Tony Tony',
        profileImageUrl: profileImageUrls[5]
      },
      {
        email: emails[6],
        username: userNames[6],
        hashedPassword: bcrypt.hashSync('mihawkPassword'),
        firstName: 'Mihawk',
        lastName: 'Dracule',
        profileImageUrl: profileImageUrls[6]
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.bulkDelete(options, { email: emails });
  }
};
