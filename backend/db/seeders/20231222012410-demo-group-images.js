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

const urls = [
  'https://images.pexels.com/photos/10647765/pexels-photo-10647765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/10350366/pexels-photo-10350366.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/10350338/pexels-photo-10350338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/776654/pexels-photo-776654.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/207924/pexels-photo-207924.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/2507025/pexels-photo-2507025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGh49ssIVPfbUnvZp74ryg-Km36tiaQ2QL0tAICM16_g5C6t4UwMxd9kwfjE68tdhJ3tk&usqp=CAU',
  'https://news.virginia.edu/sites/default/files/Header_Soccer.jpg',
  'https://villagrouploreto.s3.amazonaws.com/uploads/article/cover_en/391/what-golf-clubs-to-use-for-each-shot.jpg',
  'https://cdn.britannica.com/73/244173-050-13235B84/Royal-Flush-poker-card-game-gambling.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvZJLsQ558cchr24kJP9K0VK1ceJsuMTT-BBGIRUREuWK3uavFtegwcA6i6PyXgHNGNBs&usqp=CAU',
  'https://www.mdanderson.org/images/publications/focused-on-health/2019/web_healthy_cooking_1376x774.png.resize.702.404.jpg',
  'https://img.etimg.com/thumb/width-1200,height-1200,imgsize-73554,resizemode-75,msid-103765538/top-trending-products/sports-equipment/best-badminton-racquets-to-unleash-your-potential-and-elevate-your-game.jpg',
  'https://media.istockphoto.com/id/950300474/vector/children-swimming.jpg?s=612x612&w=0&k=20&c=4Cg3N65JBiZGHiqE3muh0_M17LHrCfOspTH_eyBvwAU='
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
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: true },
  { preview: false },
  { preview: false },
  { preview: false },
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
