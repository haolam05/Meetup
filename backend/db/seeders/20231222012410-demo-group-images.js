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
  'Trending Animes'
];

const urls = [
  'https://images.pexels.com/photos/10647765/pexels-photo-10647765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/10350366/pexels-photo-10350366.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/10350338/pexels-photo-10350338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/776654/pexels-photo-776654.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/207924/pexels-photo-207924.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/2507025/pexels-photo-2507025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
];

const groupImages = [
  { preview: true },
  { preview: false },
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: false },
  { preview: false },
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
