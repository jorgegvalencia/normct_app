var express = require('express');
var router  = express.Router();
var db      = require('../model/db');

router.get('/trials', function(req, res) {
	var range = [];
	range[0] = parseInt(req.query["offset"]) || 0;
	range[1] = parseInt(req.query["limit"]) || 10;
	console.log(range);
	var sql = 'select * from clinical_trial limit ' + range[0] + ', ' + range[1] + '';
	console.log(sql);
	db.conn.query(sql)
		.then(function(rows) {
	    	res.status(200).json({ trials: rows });
		})
		.catch(function (err) {
			console.log(err);
		})
});

router.get('/concepts', function(req, res) {
	var range = [];
	range[0] = parseInt(req.query["offset"]) || 0;
	range[1] = parseInt(req.query["limit"]) || 10;
	console.log(range);
	var sql = 'select * from concept limit ' + range[0] + ', ' + range[1] + '';
	console.log(sql);
	db.conn.query(sql)
		.then(function(rows) {
	    	res.status(200).json({ trials: rows });
		})
		.catch(function (err) {
			console.log(err);
		})
});

router.get('/criteria', function(req, res) {
	var range = [];
	range[0] = parseInt(req.query["offset"]) || 0;
	range[1] = parseInt(req.query["limit"]) || 10;
	console.log(range);
	var sql = 'select * from eligibility_criteria limit ' + range[0] + ', ' + range[1] + '';
	console.log(sql);
	db.conn.query(sql)
		.then(function(rows) {
	    	res.status(200).json({ trials: rows });
		})
		.catch(function (err) {
			console.log(err);
		})
});

router.get('/match', function(req, res) {
	var range = [];
	range[0] = parseInt(req.query["offset"]) || 0;
	range[1] = parseInt(req.query["limit"]) || 10;
	console.log(range);
	var sql = 'select * from cmatch limit ' + range[0] + ', ' + range[1] + '';
	console.log(sql);
	db.conn.query(sql)
		.then(function(rows) {
	    	res.status(200).json({ trials: rows });
		})
		.catch(function (err) {
			console.log(err);
		})
});

module.exports = router;
