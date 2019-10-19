var express = require('express');
var router = express.Router();
var db = require('../db/database')

/* GET users listing. */
router.get('/create', function(req, res, next) {
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
    })
})

router.get('/addplace', function(req, res, next) {
    db.User.findOne({
        where: {
            id: 1
        }
    }).then(dbresult => {
        dbresult.place_id.push("ketiga")
        dbresult.update({
            place_id: dbresult.place_id
        }, {
            where: {
                id: 1
            }
        }).then(updateRes => {
            res.send(updateRes)
        })
    })
});

module.exports = router;
