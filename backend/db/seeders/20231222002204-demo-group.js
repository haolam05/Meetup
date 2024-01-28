'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const { Group, User } = require('../models');

const groupNames = [
  'Morning Volleyball on the Beach',
  'Video Games By Choice',
  'Creative Board Game',
  'Trending Animes',
  'Basketball',
  'Soccer',
  'Golf',
  'Poker',
  'Karaoke',
  'Cooking',
  'Badminton',
  'Swimming'
];

const userEmails = [
  'luffy@user.io',
  'zoro@user.io',
  'zoro@user.io',
  'sanji@user.io',
  'ace@user.io',
  'ace@user.io',
  'ace@user.io',
  'robin@user.io',
  'robin@user.io',
  'robin@user.io',
  'chopper@user.io',
  'chopper@user.io'
];

const groups = [
  {
    name: groupNames[0],
    about: `Enjoy playing volleyball with people with similar interest on the beautiful Alki beach. Volleyball is a team sport in which two teams of six players are separated by a net. Each team tries to score points by grounding a ball on the other team's court under organized rules. It has been a part of the official program of the Summer Olympic Games since Tokyo 1964. Beach volleyball was introduced to the programme at the Atlanta 1996 Summer Olympics. The adapted version of volleyball at the Summer Paralympic Games is sitting volleyball.`,
    type: 'In person',
    private: false,
    city: 'Seattle',
    state: 'Washington'
  },
  {
    name: groupNames[1],
    about: `Enjoy playing different type of video games every week with a passionate group of gamers. A video game or computer game is an electronic game that involves interaction with a user interface or input device (such as a joystick, controller, keyboard, or motion sensing device) to generate visual feedback from a display device, most commonly shown in a video format on a television set, computer monitor, flat-panel display or touchscreen on handheld devices, or a virtual reality headset. Most modern video games are audiovisual, with audio complement delivered through speakers or headphones, and sometimes also with other types of sensory feedback (e.g., haptic technology that provides tactile sensations). Some video games also allow microphone and webcam inputs for in-game chatting and livestreaming.`,
    type: 'Online',
    private: true,
    city: 'Austin',
    state: 'Texas'
  },
  {
    name: groupNames[2],
    about: `Enjoy playing various type of board games created by exclusive members every week. Board games are tabletop games that typically use pieces. These pieces are moved or placed on a pre-marked board (playing surface) and often include elements of table, card, role-playing, and miniatures games as well.`,
    type: 'In person',
    private: true,
    city: 'San Francisco',
    state: 'California'
  },
  {
    name: groupNames[3],
    about: `Enjoy watching the most trending animes every week with your fellow anime fans. The earliest commercial Japanese animation dates to 1917. A characteristic art style emerged in the 1960s with the works of cartoonist Osamu Tezuka and spread in following decades, developing a large domestic audience. Anime is distributed theatrically, through television broadcasts, directly to home media, and over the Internet. In addition to original works, anime are often adaptations of Japanese comics (manga), light novels, or video games. It is classified into numerous genres targeting various broad and niche audiences.`,
    type: 'Online',
    private: false,
    city: 'Nashville',
    state: 'Tennessee',
  },
  {
    name: groupNames[4],
    about: `Enjoy playing basketball and practice your skills with others. Basketball is a team sport in which two teams, most commonly of five players each, opposing one another on a rectangular court, compete with the primary objective of shooting a basketball (approximately 9.4 inches (24 cm) in diameter) through the defender's hoop (a basket 18 inches (46 cm) in diameter mounted 10 feet (3.048 m) high to a backboard at each end of the court), while preventing the opposing team from shooting through their own hoop. A field goal is worth two points, unless made from behind the three-point line, when it is worth three. After a foul, timed play stops and the player fouled or designated to shoot a technical foul is given one, two or three one-point free throws. The team with the most points at the end of the game wins, but if regulation play expires with the score tied, an additional period of play (overtime) is mandated.`,
    type: 'In person',
    private: false,
    city: 'Seattle',
    state: 'Washington'
  },
  {
    name: groupNames[5],
    about: `Enjoy playing soccer and improve your skills with others. Association football, more commonly known as football or soccer, is a team sport played between two teams of 11 players each, who primarily use their feet to propel a ball around a rectangular field called a pitch. The objective of the game is to score more goals than the opposing team by moving the ball beyond the goal line into a rectangular-framed goal defended by the opposing team. Traditionally, the game has been played over two 45-minute halves, for a total match time of 90 minutes. With an estimated 250 million players active in over 200 countries and territories, it is the world's most popular sport.`,
    type: 'In person',
    private: true,
    city: 'Bellevue',
    state: 'Washington'
  },
  {
    name: groupNames[6],
    about: `Enjoy playing golf with others on a beautiful sunny day. Golf is a club-and-ball sport in which players use various clubs to hit a ball into a series of holes on a course in as few strokes as possible. Golf, unlike most ball games, cannot and does not use a standardized playing area, and coping with the varied terrains encountered on different courses is a key part of the game. Courses typically have either 9 or 18 holes, regions of terrain that each contain a cup, the hole that receives the ball. Each hole on a course contains a teeing ground to start from, and a putting green containing the cup. There are several standard forms of terrain between the tee and the green, such as the fairway, rough (tall grass), and various hazards such as water, rocks, or sand-filled bunkers. Each hole on a course is unique in its specific layout.`,
    type: 'In person',
    private: true,
    city: 'San Jose',
    state: 'California'
  },
  {
    name: groupNames[7],
    about: `Enjoy playing poker games online with other poker lovers. Poker is a family of comparing card games in which players wager over which hand is best according to that specific game's rules. It is played worldwide, but in some places the rules may vary. While the earliest known form of the game was played with just 20 cards, today it is usually played with a standard deck, although in countries where short packs are common, it may be played with 32, 40 or 48 cards.`,
    type: 'Online',
    private: true,
    city: 'Seattle',
    state: 'Washington',
  },
  {
    name: groupNames[8],
    about: `Enjoy singing and show off your skills with other "singers". Sing-alongs (present since the beginning of singing) fundamentally changed with the introduction of new technology. In the late 1960s and into the 1970s, stored audible materials began to dominate the music recording industry and revolutionized the portability and ease of use of band and instrumental music by musicians and entertainers as the demand for entertainers increased globally.`,
    type: 'In person',
    private: false,
    city: 'Las Vegas',
    state: 'Nevada'
  },
  {
    name: groupNames[9],
    about: `Enjoy sharing recipes and cooking a variety of dishes from different cultures. Cooking, also known as cookery or professionally as the culinary arts, is the art, science and craft of using heat to make food more palatable, digestible, nutritious, or safe. Cooking techniques and ingredients vary widely, from grilling food over an open fire, to using electric stoves, to baking in various types of ovens, reflecting local conditions.`,
    type: 'In person',
    private: false,
    city: 'Reno',
    state: 'Nevada'
  },
  {
    name: groupNames[10],
    about: `Enjoy playing badminton with others and improve your skills through competing. Badminton is a racquet sport played using racquets to hit a shuttlecock across a net. Although it may be played with larger teams, the most common forms of the game are "singles" (with one player per side) and "doubles" (with two players per side). Badminton is often played as a casual outdoor activity in a yard or on a beach; formal games are played on a rectangular indoor court. Points are scored by striking the shuttlecock with the racquet and landing it within the other team's half of the court.`,
    type: 'In person',
    private: false,
    city: 'Henderson',
    state: 'Nevada'
  },
  {
    name: groupNames[11],
    about: `Enjoy swimming with others and improve your swimming skills. Swimming is a popular recreational activity and competitive sport that involves moving through water using various techniques. It offers numerous health benefits and is suitable for people of all ages and fitness levels.`,
    type: 'In person',
    private: true,
    city: 'Edmonds',
    state: 'Washington',
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const email = userEmails[i];
      const user = await User.findOne({ where: { email } });
      group.organizerId = user.id;
    }
    await Group.bulkCreate(groups, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    await queryInterface.bulkDelete(options, { name: groupNames });
  }
};
