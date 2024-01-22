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

const urls = [
  'https://wallpapers.com/images/featured-full/one-piece-pictures-bjm9tdff9yzguoup.jpg',
  'https://wallpapers.com/images/high/one-piece-pictures-0ubzj7u8rx805ydb.webp',
  'https://wallpapers.com/images/high/one-piece-pictures-22cqxo2cws8nh3hk.webp',
  'https://cdn.vox-cdn.com/thumbor/QmYUW4WDPUe5cakWg1doB00HdBk=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/19656977/5986912410_682fed19e2_b.jpg',
  'https://wallpapers.com/images/high/monopoly-it-edition-hzkwq66wg7mwp9x5.webp',
  'https://wallpapers.com/images/high/plastic-chess-black-white-nwjq6u60qsrp6dw1.webp',
  'https://wallpapers.com/images/high/league-of-legends-dual-screen-3wyyss0c0w9f74ri.webp',
  'https://wallpapers.com/images/high/league-of-legends-dual-screen-2576-x-1610-a6alrt217s8o81s6.webp',
  'https://wallpapers.com/images/high/sport-beach-volleyball-athletes-hx7du1pwlxwatkkx.webp',
  'https://wallpapers.com/images/high/beach-volleyball-men-and-women-silhouette-pkbic20kvawofcos.webp',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMbFYf3z8XZoon4QrAZciaEcXlgozQFXPqOkI8WPiDBsnpNeQoF7VGb5VaNuNt8xbVWRY&usqp=CAU',
  'https://d3ieicw58ybon5.cloudfront.net/ex/450.450/u/27fbb0ec0344412dba96246436fe6d5e.jpg',
  'https://i.guim.co.uk/img/media/7b6e9f51cd4758e7bb5b461b521756e54b192733/0_775_4670_5836/master/4670.jpg?width=700&quality=85&auto=format&fit=max&s=e53e05399def2f52287414766e7b46e7',
  'https://imageio.forbes.com/specials-images/imageserve/5d7b1e04aea4d30008f0d674/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds',
  'https://media.istockphoto.com/id/937048674/vector/vector-illustration-of-kids-making-art-performance.jpg?s=612x612&w=0&k=20&c=sOhMafkCCvOSzMwrraGv1l2m_mtXiKnYK75Wk3wcEBE=',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFoxHcEk7X2TTgT0Ey69cZdDNQPz3RlHvvag&usqp=CAU',
  'https://i0.wp.com/anitrendz.net/news/wp-content/uploads/2021/11/loveallplay_teasertrailer2screenshot.png?fit=1920%2C1080&ssl=1',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUxFwsTTQX2h86JHIp_gCFT6ZNUbiJU98EOQ&usqp=CAU',
  'https://i.pinimg.com/originals/5b/df/d6/5bdfd6a360e0b56427d442015acbf9b8.gif',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-8x-FjPmUFCUisw4SIL6ExHGpZhnNqLDKLg&usqp=CAU',
  'https://i.pinimg.com/originals/75/a5/67/75a5673957d77321e285a94efa076490.gif',
  'https://gifdb.com/images/high/nami-cute-blush-nod-5tngxyjv2kmi1cyp.gif',
  'https://i.pinimg.com/originals/aa/41/be/aa41bec777bf2a01bcf947a99c84181b.gif',
  'https://i.pinimg.com/originals/26/1f/db/261fdbdd9daff46c9771c09e8592d6e2.gif'
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
