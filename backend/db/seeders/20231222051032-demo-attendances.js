'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const { Attendance, Event, User } = require('../models');

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

const userEmails = [
  'luffy@user.io',
  'zoro@user.io',
  'sanji@user.io',
  'ace@user.io',
  'robin@user.io',
  'chopper@user.io',
  'mihawk@user.io'
];

const status = [
  'pending',
  'waitlist',
  'attending'
];

const attendances = [
  {
    eventName: eventNames[0],
    userEmail: userEmails[0],
    status: status[2]
  },
  {
    eventName: eventNames[0],
    userEmail: userEmails[1],
    status: status[0]
  },
  {
    eventName: eventNames[0],
    userEmail: userEmails[3],
    status: status[0]
  },
  {
    eventName: eventNames[0],
    userEmail: userEmails[4],
    status: status[1]
  },
  {
    eventName: eventNames[0],
    userEmail: userEmails[5],
    status: status[1]
  },
  {
    eventName: eventNames[0],
    userEmail: userEmails[6],
    status: status[2]
  },
  {
    eventName: eventNames[1],
    userEmail: userEmails[1],
    status: status[2]
  },
  {
    eventName: eventNames[1],
    userEmail: userEmails[2],
    status: status[2]
  },
  {
    eventName: eventNames[2],
    userEmail: userEmails[2],
    status: status[1]
  },
  {
    eventName: eventNames[2],
    userEmail: userEmails[0],
    status: status[0]
  },
  {
    eventName: eventNames[3],
    userEmail: userEmails[0],
    status: status[2]
  },
  {
    eventName: eventNames[4],
    userEmail: userEmails[2],
    status: status[2]
  },
  {
    eventName: eventNames[5],
    userEmail: userEmails[2],
    status: status[2]
  },
  {
    eventName: eventNames[6],
    userEmail: userEmails[3],
    status: status[2]
  },
  {
    eventName: eventNames[6],
    userEmail: userEmails[4],
    status: status[2]
  },
  {
    eventName: eventNames[7],
    userEmail: userEmails[5],
    status: status[0]
  },
  {
    eventName: eventNames[7],
    userEmail: userEmails[6],
    status: status[2]
  },
  {
    eventName: eventNames[8],
    userEmail: userEmails[6],
    status: status[0]
  },
  {
    eventName: eventNames[9],
    userEmail: userEmails[5],
    status: status[0]
  },
  {
    eventName: eventNames[10],
    userEmail: userEmails[4],
    status: status[0]
  },
  {
    eventName: eventNames[11],
    userEmail: userEmails[4],
    status: status[2]
  },
  {
    eventName: eventNames[12],
    userEmail: userEmails[5],
    status: status[2]
  },
  {
    eventName: eventNames[13],
    userEmail: userEmails[6],
    status: status[2]
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (let i = 0; i < attendances.length; i++) {
      const attendance = attendances[i];
      const eventName = attendance.eventName;
      const userEmail = attendance.userEmail;
      const event = await Event.findOne({ where: { name: eventName } });
      const user = await User.findOne({ where: { email: userEmail } });
      attendance.eventId = event.id;
      attendance.userId = user.id;
    }
    await Attendance.bulkCreate(attendances, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    await queryInterface.bulkDelete(options, { status });
  }
};
