'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const { Group, Venue } = require('../models');

const groupNames = [
  'Trending Animes',
  'Trending Animes',
  'Trending Animes',
  'Trending Animes',
  'Trending Animes',
  'Trending Animes',
  'Trending Animes',
  'Trending Animes',
  'Trending Animes',
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
  'York St & E 17th Ave, York Street, Denver, CO 80206, United States of America',
  'Florida Ave, Valparaiso, FL, United States of America',
  '5656 East Silver Springs Boulevard, Silver Springs, Ocala, FL 34488, United States of America',
  'Park Road 71, Mineral Wells, TX 76067, United States of America',
  'Cedar Hill, Texas, United States of America',
  '4712 West Ohio Street, Chicago, IL 60644, United States of America',
  '29100 Lakeland Blvd, Wickliffe, OH 44092',
  '1790 Hanging Rock Park Rd, Danbury, NC 27016',
  '4500 Lake Washington Blvd S, Seattle, WA 98118',
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
    city: 'Denver',
    state: 'Colorado',
    lat: '39.742628',
    lng: '-104.9598638'
  },
  {
    city: 'Valparaiso',
    state: 'Florida',
    lat: '30.496686',
    lng: '-86.488622'
  },
  {
    city: 'Ocala',
    state: 'Florida',
    lat: '29.2178579',
    lng: '-82.0553756'
  },
  {
    city: 'Mineral Wells',
    state: 'Texas',
    lat: '32.8105987',
    lng: '-98.0441124'
  },
  {
    city: 'Cedar Hill',
    state: 'Texas',
    lat: '32.580181',
    lng: '-96.964675'
  },
  {
    city: 'Chicago',
    state: 'Illinois',
    lat: '41.8914913',
    lng: '-87.743719'
  },
  {
    city: 'Wickliffe',
    state: 'Ohio',
    lat: '41.6091597',
    lng: '-81.4847467'
  },
  {
    city: 'Danbury',
    state: 'North Carolina',
    lat: '36.41535',
    lng: '-80.243213'
  },
  {
    city: 'Seattle',
    state: 'Washington',
    lat: '47.5629709',
    lng: '-122.266665'
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
