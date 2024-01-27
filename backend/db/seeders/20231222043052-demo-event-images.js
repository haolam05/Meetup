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
  'Beach Volleyball',
  'All Stars Basketball Game',
  'Legendary Soccer Match',
  'Who is the best golfer?',
  'Cash Game',
  'Who wants to sing?',
  'Baking & Desert',
  'Badminton Competition Season #2',
  'Swimming Competetion Season #21',
  'Luffy Gang Reunion',
  'Zoro Gang Reunion',
  'Sanji Gang Reuninon',
  'Nami Gang Reuinion',
  'Robin Gang Reunion',
  'Chopper Gang Reunion'
];

const location = 'https://meetup2024.s3.us-west-2.amazonaws.com/public/';
const urls = [
  location + 'mugiwara+pirate.jpg',
  location + 'one+piece+festival.webp',
  location + 'luffy+gear+5.webp',
  location + 'mugiwara+priate+east+blue.jpg',
  location + 'monopoly.webp',
  location + 'chess.webp',
  location + 'league+of+legends.webp',
  location + 'league+of+legends2.webp',
  location + 'volleyball.webp',
  location + 'volleyball2.webp',
  location + 'basketball-2.jpeg',
  location + 'tsubasa.jpg',
  location + 'golf2.webp',
  location + 'poker-all-in.webp',
  location + 'karaoker2.jpg',
  location + 'baking2.jpeg',
  location + 'badminton2.webp',
  location + 'swimming2.jpeg	',
  location + 'luffy-gear5-2.gif',
  location + 'zoro.jpeg',
  location + 'sanji.gif',
  location + 'nami.gif',
  location + 'robin.gif',
  location + 'chopper.gif'
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
    preview: true
  },
  {
    eventName: eventNames[0],
    url: urls[2],
    preview: true
  },
  {
    eventName: eventNames[1],
    url: urls[3],
    preview: true
  },
  {
    eventName: eventNames[2],
    url: urls[4],
    preview: true
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
    preview: true
  },
  {
    eventName: eventNames[6],
    url: urls[10],
    preview: true
  },
  {
    eventName: eventNames[7],
    url: urls[11],
    preview: true
  },
  {
    eventName: eventNames[8],
    url: urls[12],
    preview: true
  },
  {
    eventName: eventNames[9],
    url: urls[13],
    preview: true
  },
  {
    eventName: eventNames[10],
    url: urls[14],
    preview: true
  },
  {
    eventName: eventNames[11],
    url: urls[15],
    preview: true
  },
  {
    eventName: eventNames[12],
    url: urls[16],
    preview: true
  },
  {
    eventName: eventNames[13],
    url: urls[17],
    preview: true
  },
  {
    eventName: eventNames[14],
    url: urls[18],
    preview: true
  },
  {
    eventName: eventNames[15],
    url: urls[19],
    preview: true
  },
  {
    eventName: eventNames[16],
    url: urls[20],
    preview: true
  },
  {
    eventName: eventNames[17],
    url: urls[21],
    preview: true
  },
  {
    eventName: eventNames[18],
    url: urls[22],
    preview: true
  },
  {
    eventName: eventNames[19],
    url: urls[23],
    preview: true
  }
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
