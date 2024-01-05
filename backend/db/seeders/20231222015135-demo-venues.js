'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const { Group, Venue } = require('../models');

const groupNames = [
  'Trending Animes',
  'Trending Animes',
  'Creative Board Game',
  'Creative Board Game',
  'Video Games By Choice',
  'Morning Volleyball on the Beach',
  'Basketball',
  'Soccer',
  'Golf',
  'Poker',
  'Karaoke',
  'Cooking',
  'Badminton',
  'Swimming'
];

const addresses = [
  'Tennessee Performing Arts Center (TPAC), 505 Deaderick Street, Nashville-Davidson, TN 37219, United States of America',
  'Grand Ole Opry House, 2804 Opryland Drive, Nashville-Davidson, TN 37214, United States of America',
  '234 George Street',  // private address for private group
  '345 Bob Street',     // private address for private group
  '456 Sara Street',    // private address for private group
  'Alki Beach, Seattle, WA 98116, United States of America',
  '13244 AURORA AVE NORTH',
  '567 Sara Street',    // private address for private group
  '678 Frank Street',   // private address for private group
  '789 John Street',    // private address for private group
  '450 E Fremont St UNIT 201, Las Vegas, NV 89101',
  '225 Crummer Ln, Reno, NV 89502',
  '2100 Olympic Ave., Henderson NV 89014',
  '987 Franklin Street' // private address for private group
];

const venues = [
  {
    city: 'Nashville',
    state: 'Tennessee',
    lat: '36.166350',
    lng: '-86.779050'
  },
  {
    city: 'Memphis',
    state: 'Tennessee',
    lat: '35.1140981',
    lng: '-89.9080743'
  },
  {
    city: 'Los Angeles',
    state: 'California',
    lat: '34.0536909',
    lng: '-118.242766'
  },
  {
    city: 'San Diego',
    state: 'California',
    lat: '32.7174202',
    lng: '-117.1627728'
  },
  {
    city: 'Dallas',
    state: 'Texas',
    lat: '32.7762719',
    lng: '-96.7968559'
  },
  {
    city: 'Seattle',
    state: 'Washington',
    lat: '47.5816765',
    lng: '-122.4052299'
  },
  {
    city: 'Seattle',
    state: 'Washington',
    lat: '47.726342',
    lng: '-122.343395'
  },
  {
    city: 'Bellevue',
    state: 'Washington',
    lat: '47.610149',
    lng: '-122.201515'
  },
  {
    city: 'San Jose',
    state: 'California',
    lat: '37.338207',
    lng: '-121.886330'
  },
  {
    city: 'Seattle',
    state: 'Washington',
    lat: '47.606209',
    lng: '-122.332069'
  },
  {
    city: 'Las Vegas',
    state: 'Nevada',
    lat: '36.1701879',
    lng: '-115.1409573'
  },
  {
    city: 'Reno',
    state: 'Nevada',
    lat: '39.4724559',
    lng: '-119.7893874'
  },
  {
    city: 'Henderson',
    state: 'Nevada',
    lat: '36.0737235',
    lng: '-115.0778014'
  },
  {
    city: 'Edmonds',
    state: 'Washington',
    lat: '47.811619',
    lng: '-122.376640'
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (let i = 0; i < venues.length; i++) {
      const venue = venues[i];
      const groupName = groupNames[i];
      const address = addresses[i];
      const group = await Group.findOne({ where: { name: groupName } });
      venue.groupId = group.id;
      venue.address = address;
    }
    await Venue.bulkCreate(venues, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Venues';
    await queryInterface.bulkDelete(options, { address: addresses });
  }
};
