'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const { Event, EventImage } = require('../models');

const eventNames = [
  'One Piece Live Action',
  'Anime Cosplay Festival',
  'Monopoly',
  'Chess Competition',
  'League of Legends',
  'Beach Volleyball'
];

const urls = [
  'https://wallpapers.com/images/featured-full/one-piece-pictures-bjm9tdff9yzguoup.jpg',
  'https://wallpapers.com/images/high/one-piece-pictures-0ubzj7u8rx805ydb.webp',
  'https://wallpapers.com/images/high/one-piece-pictures-22cqxo2cws8nh3hk.webp',
  'https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/218065279_368847947941314_2725135943782805192_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=dd5e9f&_nc_ohc=P_MRm1FuCxsAX8kGTyP&_nc_ht=scontent-sea1-1.xx&oh=00_AfD1tylWJH0jF3fgb_hrdBYSDPKUNJY7lqdkOE0slcvGaw&oe=658A9805',
  'https://wallpapers.com/images/high/monopoly-it-edition-hzkwq66wg7mwp9x5.webp',
  'https://wallpapers.com/images/high/plastic-chess-black-white-nwjq6u60qsrp6dw1.webp',
  'https://wallpapers.com/images/high/league-of-legends-dual-screen-3wyyss0c0w9f74ri.webp',
  'https://wallpapers.com/images/high/league-of-legends-dual-screen-2576-x-1610-a6alrt217s8o81s6.webp',
  'https://wallpapers.com/images/high/sport-beach-volleyball-athletes-hx7du1pwlxwatkkx.webp',
  'https://wallpapers.com/images/high/beach-volleyball-men-and-women-silhouette-pkbic20kvawofcos.webp'
];

const eventImages = [
  {
    eventName: eventNames[0],
    url: urls[0],
    preview: true
  },
  {
    eventName: eventNames[0],
    url: urls[1],
    preview: false
  },
  {
    eventName: eventNames[0],
    url: urls[2],
    preview: false
  },
  {
    eventName: eventNames[1],
    url: urls[3],
    preview: false
  },
  {
    eventName: eventNames[2],
    url: urls[4],
    preview: false
  },
  {
    eventName: eventNames[3],
    url: urls[5],
    preview: true
  },
  {
    eventName: eventNames[4],
    url: urls[6],
    preview: true
  },
  {
    eventName: eventNames[4],
    url: urls[7],
    preview: true
  },
  {
    eventName: eventNames[5],
    url: urls[8],
    preview: true
  },
  {
    eventName: eventNames[5],
    url: urls[9],
    preview: false
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (let i = 0; i < eventImages.length; i++) {
      const eventImage = eventImages[i];
      const eventName = eventImage.eventName;
      const event = await Event.findOne({ where: { name: eventName } });
      eventImage.eventId = event.id;
    }
    await EventImage.bulkCreate(eventImages, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    await queryInterface.bulkDelete(options, { url: urls });
  }
};
