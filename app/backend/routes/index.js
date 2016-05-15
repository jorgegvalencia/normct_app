var express = require('express');
var router  = express.Router();
var app     = express();
var db      = require('../model/db');

router.get('/trials', function(req, res) {
	var topic = req.query.topic ? 'where clinical_trial.topic LIKE \'%' + req.query.topic + '%\' ' : '';
	var sql = `select *
	from 
		clinical_trial 
		${topic} 
	limit ${req.offset}, ${req.limit}`;
	db.conn.query(sql)
		.then(function(rows) {
	    	res.status(200).json({ trials: rows });
		})
		.catch(function (err) {
			console.log(err);
			res.status(400).json({ error: err});
		})
});

router.get('/trials/count', function(req, res) {
	var topic = req.query.topic ? 'where clinical_trial.topic LIKE \'%' + req.query.topic + '%\' ' : '';
	var sql = `select count(*) as number
	from 
		clinical_trial 
		${topic} `;
	db.conn.query(sql)
		.then(function(result) {
			if(result.length > 0){
				res.status(200).json({ trials: result[0].number});
			} else {
				res.status(200).json({ trials: 0});
			}
		})
		.catch(function (err) {
			console.log(err);
			res.status(400).json({ error: err});
		})
});

router.get('/trials/:trialid', function(req, res) {
	var sql = `
	select 
		clinical_trial.title, 
		clinical_trial.topic 
	from 
		clinical_trial 
	where
		clinical_trial.nctid = '${req.params.trialid}'`;
	var trialinfo = `
	select 
		attribute.trial, 
		attribute.attribute, 
		attribute.value  
	from 
		attribute
	where
		attribute.trial = '${req.params.trialid}'`;
	var topic, title;
	db.conn.query(sql)
		.then(function(rows) {
			if(rows.length > 0){
				topic = rows[0].topic;
				title = rows[0].title;
				return db.conn.query(trialinfo);
			}
		})
		.then(function (rows) {
			var trial = {};
			for(var i=0; i<rows.length; i++){
				var key = rows[i].attribute;
				var value = rows[i].value;
				trial[key] = value;
			}
			trial['topic'] = topic;
			trial['title'] = title;
			res.status(200).json({ trial: trial });
		})
		.catch(function (err) {
			console.log(err);
			res.status(400).json({ error: err});
		})
});

router.get('/concepts', function(req, res) {
	var sql = `select *
	from 
		concept 
	where
		active = 1 
	order by concept.fsn asc 
	limit ${req.offset}, ${req.limit}`;
	db.conn.query(sql)
		.then(function(rows) {
	    	res.status(200).json({ concepts: rows });
		})
		.catch(function (err) {
			console.log(err);
			res.status(400).json({ error: err});
		})
});

router.get('/concepts/count', function(req, res) {
	var sql = `select count(*) as number
	from 
		concept 
	where 
		active = 1`;
	db.conn.query(sql)
		.then(function(result) {
			if(result.length > 0){
				res.status(200).json({ concepts: result[0].number});
			} else {
				res.status(200).json({ concepts: 0});
			}
		})
		.catch(function (err) {
			console.log(err);
			res.status(400).json({ error: err});
		})
});

router.get('/criteria', function(req, res) {
	var sql = `select *
	from 
		eligibility_criteria 
	limit ${req.offset}, ${req.limit}`;
	db.conn.query(sql)
		.then(function(rows) {
	    	res.status(200).json({ ec: rows });
		})
		.catch(function (err) {
			console.log(err);
			res.status(400).json({ error: err});
		})
});

router.get('/criteria/count', function(req, res) {
	var sql = `select count(*) as number
	from 
		eligibility_criteria`;
	db.conn.query(sql)
		.then(function(result) {
			if(result.length > 0){
				res.status(200).json({ criteria: result[0].number});
			} else {
				res.status(200).json({ criteria: 0});
			}
		})
		.catch(function (err) {
			console.log(err);
			res.status(400).json({ error: err});
		})
});

router.get('/match', function(req, res) {
	var sql = `select *
	from 
		cmatch 
	limit ${req.offset}, ${req.limit}`;
	db.conn.query(sql)
		.then(function(rows) {
	    	res.status(200).json({ matches: rows });
		})
		.catch(function (err) {
			console.log(err);
			res.status(400).json({ error: err});
		})
});

router.get('/match/count', function(req, res) {
	var sql = `select count(*) as number
	from 
		cmatch`;
	db.conn.query(sql)
		.then(function(result) {
			if(result.length > 0){
				res.status(200).json({ match: result[0].number});
			} else {
				res.status(200).json({ match: 0});
			}
		})
		.catch(function (err) {
			console.log(err);
			res.status(400).json({ error: err});
		})
});

// get eligibility criteria set of a trial
router.get('/criteria/:trialid', function (req, res) {
	var sql = `select *
	from 
		eligibility_criteria 
	where 
		eligibility_criteria.trial = '${req.params.trialid}'
	limit ${req.offset}, ${req.limit}`;
	db.conn.query(sql)
		.then(function(rows) {
	    	res.status(200).json({ concepts: rows });
		})
		.catch(function (err) {
			console.log(err);
			res.status(400).json({ error: err});
		})
})

// get the concepts that appear in a specified eligibility criteria
router.get('/trials/:trialid/criteria/:ecid/concepts', function (req, res) {
	var sql = `
	select distinct
		eligibility_criteria.number as number, 
		cmatch.phrase as phrase, 
		concept.fsn as term, 
		concept.sctid as sctid, 
		cmatch.trial as trial 
	from 
		cmatch, 
		eligibility_criteria, 
		concept 
	where 
		cmatch.trial = '${req.params.trialid}' and 
		cmatch.number = '${req.params.ecid}' and 
		cmatch.number = eligibility_criteria.number and 
		cmatch.trial = eligibility_criteria.trial and 
		cmatch.sctid = concept.sctid and 
		not eligibility_criteria.inc_exc = 0
	limit ${req.offset}, ${req.limit}`;
	db.conn.query(sql)
		.then(function(rows) {
	    	res.status(200).json({ concepts: rows });
		})
		.catch(function (err) {
			console.log(err);
			res.status(400).json({ error: err});
		})
})

router.get('/reports/frecuency', function (req, res) {
	var topic = req.query.topic === 'undefined' ? 'clinical_trial.topic LIKE %\'' + req.query.topic + '%\' and ' : '';
	var sql = `
	select 
		concept.cui as cui, 
		cmatch.sctid as sctid, 
		count(cmatch.number) as frecuency, 
		concept.fsn as concept, 
		concept.hierarchy as hierarchy,
		concept.normalform as normalform 
	from 
		clinical_trial,
		cmatch, 
		concept 
	where 
		concept.sctid = cmatch.sctid and 
		cmatch.trial = clinical_trial.nctid and 
		${topic}
		concept.active = 1 
	group by sctid 
	order by frecuency desc 
	limit ${req.offset}, ${req.limit}`;
	db.conn.query(sql)
		.then(function(rows) {
	    	res.status(200).json({ concepts: rows });
		})
		.catch(function (err) {
			console.log(err);
			res.status(400).json({ error: err});
		})
})

router.get('/reports/frecuency/detail/:conceptid', function (req, res) {
	var sql = `
	select 
		concept.fsn, 
		cmatch.trial, 
		cmatch.phrase, 
		cmatch.synonym, 
		cmatch.matched_words, 
		eligibility_criteria.utterance 
	from 
		cmatch, 
		concept, 
		eligibility_criteria 
	where  
		cmatch.sctid = '${req.params.conceptid}' and 
		cmatch.sctid = concept.sctid and 
		cmatch.number = eligibility_criteria.number and 
		concept.active = 1 and 
		cmatch.trial = eligibility_criteria.trial 
	limit ${req.offset}, ${req.limit}`;
	db.conn.query(sql)
		.then(function(rows) {
	    	res.status(200).json({ matches: rows });
		})
		.catch(function (err) {
			console.log(err);
			res.status(400).json({ error: err});
		})
})

router.get('/reports/normalform', function (req, res) {
	var sql = `
	select 
		concept.cui as cui,
		concept.sctid as sctid, 
		fsn as concept, 
		count(fsn) as frecuency, 
		concept.hierarchy as hierarchy 
	from
		refinement, 
		concept, 
		cmatch 
	where 
		(attribute_concept = concept.sctid or value_concept = concept.sctid) and
		concept.sctid = cmatch.sctid and 
		concept.active = 1 
	group by fsn 
	order by frecuency desc 
	limit ${req.offset}, ${req.limit}`;
	db.conn.query(sql)
		.then(function(rows) {
	    	res.status(200).json({ concepts: rows });
		})
		.catch(function (err) {
			console.log(err);
			res.status(400).json({ error: err});
		})
})



module.exports = router;
