var express = require('express');
var router = express.Router();
var db = require('../db/database');
const request = require('request');

/* GET users listing. */
router.get('/getplace', async (req,res) => {
    await request.get({
        headers: {
          'Accept': 'application/json'
        },
        url:     'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + req.query.lat + ',' + req.query.lon + '&radius=10000&type=park&key=AIzaSyCYjt7ngtOeL04bdX5CTrKgNs8aezmhrCc'
    }, async function(error, response, body){
      // console.log(JSON.parse(body).results)
      let objRes = {
        result: JSON.parse(body).results.slice(0,10)
      }
      
      // console.log(typeof JSON.parse(body))
      res.end(JSON.stringify(objRes))
    })
})

router.get('/create', function(req, res, next) {
    // db.User.update({
    //     place_id: ['ChIJF6cDDq_paC4RuL4qblw-Ca0']
    // }, {
    //     where: {
    //         id: 3
    //     }
    // })
    db.User.findAll().then(dbresult => {
        res.send(dbresult);
    })
});

router.get('/checkuser', function(req, res, next) {
    db.User.findOne({
        where: {
            uid: req.query.uid
        }
    }).then(findRes => {
        if(findRes) {
           return res.send({
               status: 'registered'
           }) 
        }
        return res.send({
            status: 'not registered'
        })
    })
})

router.get('/adduser', function(req, res, next) {
    db.User.findOne({
        where: {
            uid: req.query.uid
        }
    }).then(findRes => {
        if(!findRes) {
            db.User.create({
                uid: req.query.uid,
                place_id: []
            })
        }
        res.send({
            result: 'ok'
        })
    })
})

router.get('/addplace', function(req, res, next) {
    db.User.findOne({
        where: {
            uid: req.query.uid
        }
    }).then(async (dbresult) => {
        console.log(dbresult.place_id.indexOf(req.query.placeid) == -1)
        console.log(dbresult.place_id)
        if(dbresult.place_id.indexOf(req.query.placeid) == -1) {
            dbresult.place_id.push(req.query.placeid)
            await dbresult.update({
                place_id: dbresult.place_id
            }, {
                where: {
                    uid: req.query.uid
                }
            }).then(updateRes => {
                // console.log(updateRes)
                res.send(updateRes)
            })
        }
        res.send({
            result: 'ok'
        })
    })
});

module.exports = router;