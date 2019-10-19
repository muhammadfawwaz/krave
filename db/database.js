var pg = require('pg');
pg.defaults.ssl = true;
const Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://ydftovoxthxhid:35d7f8f4bfaa2d7f3a28119336be5b35e82dcb326204d73189db46b01e73742b@ec2-174-129-18-42.compute-1.amazonaws.com:5432/dfn7sh2l83ujr9');

var User = sequelize.define('user', {
    uid: {
      type: Sequelize.STRING,
    },
    place_id: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    }
});

exports.User = User