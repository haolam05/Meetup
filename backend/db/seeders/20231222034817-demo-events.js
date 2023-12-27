'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const { Group, Venue, Event } = require('../models');

const groupNames = [
  'Trending Animes',
  'Creative Board Game',
  'Video Games By Choice',
  'Morning Volleyball on the Beach'
];

const venueAddresses = [
  null, // 'Tennessee Performing Arts Center (TPAC), 505 Deaderick Street, Nashville-Davidson, TN 37219, United States of America',
  'Grand Ole Opry House, 2804 Opryland Drive, Nashville-Davidson, TN 37214, United States of America',
  '234 George Street',
  '345 Bob Street',
  null, // '456 Sara Street',
  'Alki Beach, Seattle, WA 98116, United States of America'
];

const eventNames = [
  'One Piece Live Action',
  'Anime Cosplay Festival',
  'Monopoly',
  'Chess Competition',
  'League of Legends',
  'Beach Volleyball'
];

const events = [
  {
    groupName: groupNames[0],
    venueAddress: venueAddresses[0],
    name: eventNames[0],
    description: 'Watch One Piece Live Action series that was released by Netflix in 2023.',
    type: 'Online',
    capacity: 20,
    price: 55.5,
    startDate: '2023-12-24',
    endDate: '2023-12-28'
  },
  {
    groupName: groupNames[0],
    venueAddress: venueAddresses[1],
    name: eventNames[1],
    description: 'Anime Cosplay includes One Piece, Naruto, Dragon Ball, Attack on Titan, etc.',
    type: 'In person',
    capacity: 20,
    price: 66.6,
    startDate: '2023-12-29',
    endDate: '2024-01-01'
  },
  {
    groupName: groupNames[1],
    venueAddress: venueAddresses[2],
    name: eventNames[2],
    description: 'Playing a variety of monopoly varients. There is a gift for the winner who accumulates the most points.',
    type: 'In person',
    capacity: 50,
    price: 77.7,
    startDate: '2024-06-06',
    endDate: '2024-06-09'
  },
  {
    groupName: groupNames[1],
    venueAddress: venueAddresses[3],
    name: eventNames[3],
    description: 'Players will compete among different chess variants, including: international chess, chinese chess, and Fischer random chess.',
    type: 'In person',
    capacity: 100,
    price: 99.9,
    startDate: '2023-12-01',
    endDate: '2024-03-01'
  },
  {
    groupName: groupNames[2],
    venueAddress: venueAddresses[4],
    name: eventNames[4],
    description: 'Playing League of Legends, and enjoy lots of free food. There are pizzas, ramens, and smoothies!',
    type: 'Online',
    capacity: 10,
    price: 22.2,
    startDate: '2024-02-03',
    endDate: '2024-02-04'
  },
  {
    groupName: groupNames[3],
    venueAddress: venueAddresses[5],
    name: eventNames[5],
    description: `Let's enjoy the sun on the beach and play professional volleyball.`,
    type: 'In person',
    capacity: 100,
    price: 33.3,
    startDate: '2023-12-01',
    endDate: '2023-12-02'
  },
];


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const groupName = event.groupName;
      const venueAddress = event.venueAddress;
      const group = await Group.findOne({ where: { name: groupName } });
      const venue = await Venue.findOne({ where: { address: venueAddress } });
      event.groupId = group.id;
      event.venueId = venue ? venue.id : null;
      event.startDate = new Date(event.startDate);
      event.endDate = new Date(event.endDate);
    }
    await Event.bulkCreate(events, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Events';
    await queryInterface.bulkDelete(options, { name: eventNames });
  }
};
