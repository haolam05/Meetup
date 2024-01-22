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

const venueAddresses = [
  null,   // Online
  'Grand Ole Opry House, 2804 Opryland Drive, Nashville-Davidson, TN 37214, United States of America',
  '234 George Street',
  '345 Bob Street',
  null,   // Online
  'Alki Beach, Seattle, WA 98116, United States of America',
  '13244 AURORA AVE NORTH',
  '567 Sara Street',
  '678 Frank Street',
  null,   // Online
  '450 E Fremont St UNIT 201, Las Vegas, NV 89101',
  '225 Crummer Ln, Reno, NV 89502',
  '2100 Olympic Ave., Henderson NV 89014',
  '987 Franklin Street',
  null,   // Online
  null,   // Online
  null,   // Online
  null,   // Online
  null,   // Online
  null,   // Online
];

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
  {
    groupName: groupNames[4],
    venueAddress: venueAddresses[6],
    name: eventNames[6],
    description: `Let's show off your skills by competing in a basketball game amongst all-star players this season.`,
    type: 'In person',
    capacity: 100,
    price: 333.67,
    startDate: '2024-02-02',
    endDate: '2024-02-03'
  },
  {
    groupName: groupNames[5],
    venueAddress: venueAddresses[7],
    name: eventNames[7],
    description: `Let's show off your soccer skills and your strategy in a friendly soccer match with our members.`,
    type: 'In person',
    capacity: 250,
    price: 678.89,
    startDate: '2024-02-10',
    endDate: '2024-02-11'
  },
  {
    groupName: groupNames[6],
    venueAddress: venueAddresses[8],
    name: eventNames[8],
    description: `Let's play some golf while enjoying the beautiful weather here. There are free snacks!`,
    type: 'In person',
    capacity: 100,
    price: 123.45,
    startDate: '2024-03-01',
    endDate: '2024-04-01'
  },
  {
    groupName: groupNames[7],
    venueAddress: venueAddresses[9],
    name: eventNames[9],
    description: `Let's gamble! Participate in a cash game with no buy-in limit.`,
    type: 'Onilne',
    capacity: 500,
    price: 444.44,
    startDate: '2024-06-05',
    endDate: '2024-06-06'
  },
  {
    groupName: groupNames[8],
    venueAddress: venueAddresses[10],
    name: eventNames[10],
    description: `Do you like to sing? Let's sing together! Our system has a variety of songs for you to choose from.`,
    type: 'In person',
    capacity: 150,
    price: 222.33,
    startDate: '2024-07-07',
    endDate: '2024-07-10'
  },
  {
    groupName: groupNames[9],
    venueAddress: venueAddresses[11],
    name: eventNames[11],
    description: `Let's bake some bread and make some desserts for your loved ones.`,
    type: 'In person',
    capacity: 100,
    price: 55.55,
    startDate: '2024-08-08',
    endDate: '2024-08-09'
  },
  {
    groupName: groupNames[10],
    venueAddress: venueAddresses[12],
    name: eventNames[12],
    description: `Let's compete in a badminton game to find out who's the best!`,
    type: 'In person',
    capacity: 100,
    price: 400.21,
    startDate: '2024-11-11',
    endDate: '2024-12-11'
  },
  {
    groupName: groupNames[11],
    venueAddress: venueAddresses[13],
    name: eventNames[13],
    description: `Let's swim! Don't hesitate to join because swimming has several health benefits!`,
    type: 'In person',
    capacity: 50,
    price: 49.99,
    startDate: '2024-12-30',
    endDate: '2024-12-31'
  },
  {
    groupName: groupNames[0],
    venueAddress: venueAddresses[14],
    name: eventNames[14],
    description: `Known for his signature straw hat and elastic limbs, Luffy always remains optimistic no matter the danger he encounters. With a pure heart, he easily wins over his crew's loyalty — and often drives his rivals crazy. “He is a super cheerful guy, full of joy,” Iñaki Godoy told Netflix during production.`,
    type: 'Online',
    capacity: 12,
    price: 12.21,
    startDate: '2026-10-30',
    endDate: '2026-12-31'
  },
  {
    groupName: groupNames[0],
    venueAddress: venueAddresses[15],
    name: eventNames[15],
    description: `Zoro has a stern, serious, and distanced personality, but unlike Robin, he often reacts in a goofy and exaggerated comic style due to his short-tempered and impatient attitude. On the ship, he normally either trains with weights or sleeps.`,
    type: 'Online',
    capacity: 23,
    price: 23.32,
    startDate: '2026-09-30',
    endDate: '206-11-31'
  },
  {
    groupName: groupNames[0],
    venueAddress: venueAddresses[16],
    name: eventNames[16],
    description: `Sanji is a slim, muscular, long-legged man with blond hair which he keeps brushed over one side of his face. Before the timeskip, this was the left side. After the two-year timeskip, he switched his hairstyle so that it covers the right side.`,
    type: 'Online',
    capacity: 34,
    price: 34.43,
    startDate: '2019-12-30',
    endDate: '2029-12-31'
  },
  {
    groupName: groupNames[0],
    venueAddress: venueAddresses[17],
    name: eventNames[17],
    description: `In the series, Nami is the Straw Hat Pirates' navigator, who dreams of drawing a map of the entire world. Despite her initial distrust of pirates, Nami eventually changes her mind after being around Luffy and the rest of the crew. Nami is depicted as an intelligent girl who is obsessed with obtaining money.`,
    type: 'Online',
    capacity: 56,
    price: 56.65,
    startDate: '2025-01-01',
    endDate: '2025-01-31'
  },
  {
    groupName: groupNames[0],
    venueAddress: venueAddresses[18],
    name: eventNames[18],
    description: `Nico Robin is an extremely tall, slender, yet athletic young woman with shoulder-length black hair and brown eyes with dark, wide pupils (blue eyes in the anime, excluding the tenth and the twelfth movie). She also has a long, thin and defined nose.`,
    type: 'Online',
    capacity: 67,
    price: 67.76,
    startDate: '2025-12-30',
    endDate: '2025-12-31'
  },
  {
    groupName: groupNames[0],
    venueAddress: venueAddresses[19],
    name: eventNames[19],
    description: `Tony Tony Chopper is a half-reindeer, half-human hybrid who gained this ability after eating the Hito Hito no Mi or the Human-Human Fruit, which allows him to be able to walk and talk like a human. He is also able to transform into different forms that are suitable for battle situations.`,
    type: 'Online',
    capacity: 78,
    price: 78.87,
    startDate: '2025-11-30',
    endDate: '2025-11-31'
  }
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
