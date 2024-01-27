'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const { GroupImage, Group } = require('../models');

const groupNames = [
  'Morning Volleyball on the Beach',
  'Morning Volleyball on the Beach',
  'Morning Volleyball on the Beach',
  'Video Games By Choice',
  'Video Games By Choice',
  'Creative Board Game',
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

const location = 'https://meetup2024.s3.us-west-2.amazonaws.com/public/';
const urls = [
  location + 'volleyball.jpeg',
  location + 'volleyball-2.jpeg',
  location + 'volleyball-3.jpeg',
  location + 'video-games.jpeg',
  location + 'video-games-2.jpeg',
  location + 'board-game.png',
  location + 'board-game-2.jpeg',
  location + 'theater.jpeg',
  location + 'basketball.jpeg',
  location + 'soccer.jpg',
  location + 'golf.jpg',
  location + 'poker.webp',
  location + 'karaoke.jpeg',
  location + 'cooking.jpg',
  location + 'badminton.webp',
  location + 'swimming.jpg'
];

const groupImages = [
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: true },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (let i = 0; i < groupNames.length; i++) {
      const groupName = groupNames[i];
      const groupImage = groupImages[i];
      const group = await Group.findOne({ where: { name: groupName } });
      const url = urls[i];
      groupImage.groupId = group.id;
      groupImage.url = url;
    }
    await GroupImage.bulkCreate(groupImages, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    await queryInterface.bulkDelete(options, { url: urls });
  }
};
