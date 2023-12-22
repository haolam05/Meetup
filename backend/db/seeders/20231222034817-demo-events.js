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
  'Tennessee Performing Arts Center (TPAC), 505 Deaderick Street, Nashville-Davidson, TN 37219, United States of America',
  'Grand Ole Opry House, 2804 Opryland Drive, Nashville-Davidson, TN 37214, United States of America',
  '234 George Street',
  '345 Bob Street',
  '456 Sara Street',
  'Alki Beach, Seattle, WA 98116, United States of America'
];

const events = [
  {
    groupName: groupNames[0],
    venueAddress: venueAddresses[0],
    name: 'One Piece Live Action',
    description: 'Watch One Piece Live Action series that was released by Netflix in 2023.',
    type: 'Online',
    capacity: 20,
    price: 555,
    startDate: '2023-12-24',
    endDate: '2023-12-28'
  },
  {
    groupName: groupNames[0],
    venueAddress: venueAddresses[1],
    name: 'Anime Cosplay Festival',
    description: 'Anime Cosplay includes One Piece, Naruto, Dragon Ball, Attack on Titan, etc.',
    type: 'In person',
    capacity: 20,
    price: 666,
    startDate: '2023-12-29',
    endDate: '2024-01-01'
  },
  {
    groupName: groupNames[1],
    venueAddress: venueAddresses[2],
    name: 'Monopoly',
    description: 'Playing a variety of monopoly varients. There is a gift for the winner who accumulates the most points.',
    type: 'In person',
    capacity: 50,
    price: 777,
    startDate: '2024-06-06',
    endDate: '2024-06-09'
  },
  {
    groupName: groupNames[1],
    venueAddress: venueAddresses[3],
    name: 'Chess Competition',
    description: 'Players will compete among different chess variants, including: international chess, chinese chess, and Fischer random chess.',
    type: 'In person',
    capacity: 100,
    price: 999,
    startDate: '2023-12-01',
    endDate: '2024-03-01'
  },
  {
    groupName: groupNames[2],
    venueAddress: venueAddresses[4],
    name: 'League of Legends',
    description: 'Playing League of Legends, and enjoy lots of free food. There are pizzas, ramens, and smoothies!',
    type: 'Online',
    capacity: 10,
    price: 222,
    startDate: '2024-02-03',
    endDate: '2024-02-04'
  },
  {
    groupName: groupNames[3],
    venueAddress: venueAddresses[5],
    name: 'Beach Volleyball',
    description: `Let's enjoy the sun on the beach and play professional volleyball.`,
    type: 'In person',
    capacity: 100,
    price: 333,
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
      event.venueId = venue.id;
      event.startDate = new Date(event.startDate);
      event.endDate = new Date(event.endDate);
    }
    await Event.bulkCreate(events, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    const groups = await Promise.all(groupNames.map(name => Group.findOne({ where: { name } })));
    const groupIds = groups.map(group => group.id);
    options.tableName = 'Events';
    await queryInterface.bulkDelete(options, { groupId: groupIds });
  }
};
