var pg = require('pg');
pg.defaults.ssl = true;
const Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://ydftovoxthxhid:35d7f8f4bfaa2d7f3a28119336be5b35e82dcb326204d73189db46b01e73742b@ec2-174-129-18-42.compute-1.amazonaws.com:5432/dfn7sh2l83ujr9');

var User = sequelize.define('user', {
    uid: {
      type: Sequelize.STRING,
    },
    method: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    },
    place_id: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    date: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    budget: {
      type: Sequelize.STRING
    },
    latlonfrom: {
      type: Sequelize.STRING
    },
    latlonto: {
      type: Sequelize.STRING
    },
    place_state: {
      type: Sequelize.STRING,
    },
    departure: {
      type: Sequelize.STRING,
    },
    arrival: {
      type: Sequelize.STRING,
    },
    flightname: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    flightprice: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    hotelname: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    hotelprice: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    fnbname: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    fnbprice: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
});

var State = sequelize.define('state', {
  uid: {
    type: Sequelize.STRING,
  },
  lastid: {
    type: Sequelize.STRING,
  },
  place_state: {
    type: Sequelize.STRING,
  },
})

// State.sync({force: true}).then(function () {
//   State.create({
//     uid: "tesinf",
//     lastid: 1
//   })
// })

// State.destroy({
//   where: {},
//   truncate: true
// })

// User.destroy({
//   where: {uid: 'Uf2d1b3c98f073d2a12c745049111ca2e'},
//   // truncate: true
// })

// State.sync({force: true}).then(function () {
//   State.create({
//     uid: "tesinf",
//     lastid: 1
//   })
// })

// User.sync({force: true}).then(function () {
//   User.create({
//     uid: "tesinf",
//   })
// })

exports.User = User
exports.State = State