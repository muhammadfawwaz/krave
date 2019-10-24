var express = require('express');
var router = express.Router();
var db = require('../db/database');
const request = require('request');
// import single  from 'air-port-codes-node';

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

router.get('/updatestate', function(req, res, next) {
    let uid = req.query.uid
    let place_id = req.query.place_id

    db.User.update({
        place_state: place_id
    }, {
        where: {
            uid: uid
        }
    })
})

router.get('/detailstate', function(req, res, next) {
    db.User.findAll().then(dbresult => {
        res.render('detail',{result: dbresult})
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

router.get('/getdata', function(req, res, next) {
    db.User.findOne({
        where: {
            uid: req.query.uid
        }
    }).then(findResult => {
        var convObj = []
        console.log(findResult.place_id)
        findResult.place_id.forEach(r => {
            convObj.push({
                place_id: r
            })
        })
        res.send({
            result: convObj
        })
    })
})

router.get('/addplace', function(req, res, next) {
    db.User.findOne({
        where: {
            uid: req.query.uid,
            id: req.query.id
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
                // return res.send(updateRes)
            })
        }
        return res.send({
            result: 'ok'
        })
    })
});

router.get('/getdetail', async function(req, res, next) {
    db.State.findOne({
        where: {
            uid: req.query.uid
        }
    }).then(async (dbresult) => {
        await request.get({
            headers: {
              'Accept': 'application/json'
            },
            url:     'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + dbresult.place_state + '&key=AIzaSyCYjt7ngtOeL04bdX5CTrKgNs8aezmhrCc'
        }, async function(error, response, body){
            let objRes = {
                result: JSON.parse(body).result
            }
            
            // console.log(typeof JSON.parse(body))
            res.end(JSON.stringify(objRes))
        })
    })
})

router.get('/getindex', async function(req, res, next) {
    console.log(req.query)
    db.State.findOne({
        where: {
            uid: req.query.uid
        }
    }).then(async (dbresult) => {
        return res.send({
            result: dbresult.lastid
        })
        // if(dbresult) return res.send({
        //     result: dbresult.length-1
        // })
        // return res.send({
        //     result: ''
        // })
    })
})

router.get('/edituserdata', async function(req, res, next) {
    console.log(req.query)
    await editUserData(req.query.uid,req.query.col,req.query.val,req.query.id)
    res.send({
        result: 'ok'
    })
})

router.get('/deleteitinerary', async function(req, res, next) {
    await db.User.destroy({
      where: {
        uid: req.query.uid,
        id: req.query.id
      },
    })
    res.send({
        result: 'ok'
    })
})

router.get('/changeitinerary', async function(req, res, next) {
    await db.User.update({
        status: 'history'
    }, {
        where: {
            uid: req.query.uid,
            id: req.query.id
        }
    })
    res.send({
        result: 'ok'
    })
})

router.get('/historyitinerary', async function(req, res, next) {
    db.User.findAll({
        where: {
            uid: req.query.uid,
            status: 'history'
        }
    }).then(findRes => {
        res.send({
            result: 'ok'
        })
    })
})

router.get('/readitinerary', async function(req, res, next) {
    db.User.findAll({
        where: {
            uid: req.query.uid,
            status: null
        }
    }).then(findRes => {
        let arrRes = []
        if(findRes.length > 0) {
            for(var val in findRes) {
                // console.log(findRes[val])
                if(findRes[val].place_id.length > 0) {
                    arrRes.push(findRes[val])
                }
            }
            res.send({
                result: arrRes
            })
        }
        else {
            res.send({
                result: 'ok'
            })
        }
    })
})

router.get('/findiata', async function(req, res, next) {
    await request.post({
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'APC-Auth': '420861f4d9',
          'APC-Auth-Secret': '24eb1e281755d62'
        },
        url:     'https://www.air-port-codes.com/api/v1/multi',
        form: {
            limit: 7,
            term: req.query.loc
        }
    }, async function(error, response, body){
        res.send(body)
    })

})

router.get('/getflightprice', async function(req, res, next) {
    var Amadeus = require('amadeus');

    var amadeus = new Amadeus({
    clientId: 'OQmBTXhl1ztG6M3OdQnGxXNfO49haDPs',
    clientSecret: 'nVu17AE2JsbeBFWQ'
    });

    console.log(req.query.date.split('T')[0])

    amadeus.shopping.flightOffers.get({
        origin : req.query.from,
        destination : req.query.to,
        departureDate : req.query.date.split('T')[0],
        currency: 'IDR'
      }).then(response => {
        //   console.log(response.result)
        //   res.send(response.result.data[0].offerItems[0].pricePerAdult)
        let finalResult = []
        let result = response.result.data
        for(var i in result) {
            let code = ''
            let flightcode = ''
            let flightname = ''
            let over = result[i].offerItems[0].services[0].segments
            // console.log(result[i].offerItems[0].services[0])
            for(var j in over) {
                // console.log(over[j].flightSegment.departure.iataCode)
                code += over[j].flightSegment.departure.iataCode + ' - ' + over[j].flightSegment.arrival.iataCode + ', '
                flightcode += over[j].flightSegment.carrierCode + ', '
                flightname = over[j].flightSegment.aircraft.code == 'GA' ? 'Garuda Indonesia' : over[j].flightSegment.aircraft.code
            }
            finalResult.push({
                code: code,
                price: result[i].offerItems[0].pricePerAdult.totalTaxes,
                flightcode: flightcode,
                flightname: flightname
            })
        }
        res.send({
            list: finalResult
        })
      })
})

router.get('/getcity', async function(req, res, next) {
    await request.get({
        headers: {
          'Accept': 'application/json'
        },
        url:     'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + req.query.lat + ',' + req.query.lon + '&key=AIzaSyBXA-NtEXB55XNuh695WEXRn1F9sNOyONs',
    }, async function(error, response, body){
        let city = ''
        let com = JSON.parse(body).results[0].address_components
        for(var i in com) {
            console.log(com[i].types[0] == 'administrative_area_level_2')
            if(com[i].types[0] == 'administrative_area_level_2') {
                if(com[i].long_name.split(' ')[0] == 'Kota' || com[i].long_name.split(' ')[0] == 'Kabupaten') {
                    city = com[i].long_name.split(' ')[1]
                }
            }
        }
        await request.post({
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
              'APC-Auth': '420861f4d9',
              'APC-Auth-Secret': '24eb1e281755d62'
            },
            url:     'https://www.air-port-codes.com/api/v1/multi',
            form: {
                limit: 7,
                term: city
            }
        }, async function(error, response, body){
            res.send({
                iat: JSON.parse(body).airports[0].iata
            })
        })
    })
})

router.get('/readdetailitinerary', async function(req, res, next) {
    db.User.findOne({
        where: {
            uid: req.query.uid,
            id: req.query.id,
            status: null
        }
    }).then(async(findRes) => {
        let arrRes = []
        console.log(findRes.place_id)
        if(findRes) {
            for(var i = 0 ; i <  findRes.place_id.length; i++) {
                await request.get({
                    headers: {
                      'Accept': 'application/json'
                    },
                    url:     'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + findRes.place_id[i] + '&key=AIzaSyCYjt7ngtOeL04bdX5CTrKgNs8aezmhrCc'
                }, async function(error, response, body){
                    // console.log(JSON.parse(body).result)
                    arrRes.push(JSON.parse(body).result)
                    if(arrRes.length == findRes.place_id.length) {
                        res.send({
                            result: arrRes
                        })
                    }
                })
            }
        }
        else {
            res.send({
                result: 'ok'
            })
        }
    })
})

function editUserData(uid,col,val,id) {
    if(col == 'add') {
        db.User.findOne({
            where: {
                uid: uid
            }
        }).then(findRes => {
            if(!findRes) {
                db.User.create({
                    uid: uid,
                    place_id: [],
                    flightname: [],
                    flightprice: [],
                    hotelname: [],
                    hotelprice: [],
                    fnbname: [],
                    fnbprice: []
                })
            }
        })
    }
    else if (col == 'method'){
        db.User.create({
            uid: uid,
            place_id: [],
            method: val
        }).then(dbcreate => {
            db.State.findOne({
                where: {
                    uid: uid
                }
            }).then(findRes => {
                if(findRes) {
                    db.State.update({
                        lastid: dbcreate.id
                    }, {
                        where: {
                            uid: uid,
                        }
                    })
                }
                else {
                    db.State.create({
                        uid: uid,
                        lastid: dbcreate.id
                    })
                }
            })
        })
    }
    else if (col == 'placestate'){
        db.State.update({
            place_state: val
        }, {
            where: {
                uid: uid,
            }
        })
    }
    else {
        let msg = {}
        if(col == 'title') {
            msg = {
                title: val
            }
        }
        else if (col == 'latlon'){
            msg = {
                latlon: val
            }
        }
        else if (col == 'date'){
            msg = {
                date: val
            }
        }
        else if (col == 'status'){
            msg = {
                status: val
            }
        }
        else if (col == 'budget'){
            msg = {
                method: val
            }
        }
        
        db.User.update(msg, {
            where: {
                uid: uid,
                id:id
            }
        })
    }
}

module.exports = router;
