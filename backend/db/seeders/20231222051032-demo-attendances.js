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
  'Beach Volleyball'
];

const userEmails = [
  'demo@user.io',
  'user1@user.io',
  'user2@user.io'
];

const attendances = [
  {
    eventName: eventNames[0],
    userEmail: userEmails[0],
    status: 'attending'
  },
  {
    eventName: eventNames[0],
    userEmail: userEmails[1],
    status: 'pending'
  },
  {
    eventName: eventNames[0],
    userEmail: userEmails[2],
    status: 'waitlist'
  },
  {
    eventName: eventNames[1],
    userEmail: userEmails[1],
    status: 'attending'
  },
  {
    eventName: eventNames[1],
    userEmail: userEmails[2],
    status: 'attending'
  },
  {
    eventName: eventNames[2],
    userEmail: userEmails[1],
    status: 'waitlist'
  },
  {
    eventName: eventNames[2],
    userEmail: userEmails[0],
    status: 'pending'
  },
  {
    eventName: eventNames[3],
    userEmail: userEmails[0],
    status: 'attending'
  },
  {
    eventName: eventNames[4],
    userEmail: userEmails[1],
    status: 'attending'
  },
  {
    eventName: eventNames[5],
    userEmail: userEmails[2],
    status: 'attending'
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
    await queryInterface.bulkDelete(options, { status: ['attending', 'waitlist', 'pending'] });
  }
};
