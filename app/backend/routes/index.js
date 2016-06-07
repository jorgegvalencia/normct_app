var express = require('express');
var router  = express.Router();
var app     = express();
var db      = require('../model/db');
var spawn   = require('child_process').spawn;
var clients = require('../model/clients');

router.post('/process/trial', function(req, res) {
	var pattern = new RegExp(/NCT[0-9]{8}/i);
	var trial = req.body.trial;
	var socketid = req.body.socket;
	if(!trial || !pattern.test(trial) || !socketid){
		return res.status(404).json({ message: 'Trial doesn\'t match NCTID format'});
	}
	trial = trial.toUpperCase();
	console.log('Lanzando ECCET: ', trial);
    var child = spawn('java', ['-jar', 'NormCTApp.jar', '-t', trial], { cwd: '..', detached: true, stdio: ['ignore'] });
    child.unref();
    clients[socketid] && clients[socketid].emit('singleTrialSocket', { status: 'Start', message: 'Tarea '+child.pid+' iniciada'});
    child.on('close', function (exitCode) {
        if (exitCode !== 0) {
            console.error('Something went wrong!');
            clients[socketid] && clients[socketid].emit('singleTrialSocket',  {status: 'Failure', message: 'Tarea '+child.pid+ ' finalizada para el ensayo '+ trial, code: exitCode});
        }
        else {
        	clients[socketid] && clients[socketid].emit('singleTrialSocket', { status: 'Ended', message: 'Tarea '+child.pid+ ' finalizada para el ensayo '+ trial, trial: trial, code: exitCode});
        	console.log('Tarea '+child.pid+ ' finalizada para el ensayo '+ trial, exitCode);
        }
    });
    child.stdout.on('data', function(data) {
    	if(data.toString().indexOf('ERROR') > -1){
    		console.log(data.toString());
        	clients[socketid] && clients[socketid].emit('singleTrialSocket',  { status: 'Error', message: data.toString()});  		
    	}
    	else if(data.toString() !== '\n'){
    		console.log(data.toString());
    		clients[socketid] && clients[socketid].emit('singleTrialSocket', { status: 'Running', message: data.toString()});
    	}
    });
    child.stderr.on('data', function(data) {
    	console.log(data.toString());
        	clients[socketid] && clients[socketid].emit('singleTrialSocket',  { status: 'Error', message: data.toString()});    		
    });
    res.status(200).json({ message: 'OK'});
})

router.post('/process/trials', function(req, res) {
	var trials = req.body.trials;
	var socketid = req.body.socket;
	if(!trials  || trials.length < 1 || !socketid){
		return res.status(404).json({ message: 'Trial list can\'t be empty'});
	}
	console.log('Lanzando ECCET: ', trials);
	var options = ['-jar', 'NormCTApp.jar', '-tl'];
	options = options.concat(trials);
	console.log(options);
    var child = spawn('java', options, {
    	cwd: '..',
        detached: true,
        stdio: ['ignore']
    });
	clients[socketid] && clients[socketid].emit('trialListSocket', { status: 'Start', message: 'Tarea '+child.pid+' iniciada'});
    child.unref();
    child.on('exit', function (exitCode) {
        if (exitCode !== 0) {
            console.error('Something went wrong!');
            clients[socketid] && clients[socketid].emit('trialListSocket', {status: 'Failure', message: 'Tarea '+child.pid+ ' finalizada para el listado de ensayos ' + trials, code: exitCode});
        }
        else {
        	console.log('Tarea '+child.pid+ ' finalizada ', exitCode);
        	clients[socketid] && clients[socketid].emit('trialListSocket', {status: 'Ended', message: 'Tarea '+child.pid+ ' finalizada para el listado de ensayos ' + trials, code: exitCode});
        }
    });
    child.stdout.on('data', function(data) {
        if (data.toString().indexOf('ERROR') > -1) {
            console.log(data.toString());
            res.io.clients[socketid] && clients[socketid].emit('trialListSocket', { status: 'Error', message: data.toString()});
        } else if (data.toString() !== '\n') {
            console.log(data.toString());
            clients[socketid] && clients[socketid].emit('trialListSocket', { status: 'Running', message: data.toString()})
        }
    });

    child.stderr.on('data', function(data) {
    	console.log(data.toString());
        clients[socketid] && clients[socketid].emit('trialListSocket', { status: 'Error', message: data.toString()}); 
    });
    // child.stdout.pipe(res);
    res.status(200).json({ message: 'OK'});
})

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
	    	res.status(200).json({ ec: rows });
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
		cmatch.phrase as phrase, 
		concept.fsn as term, 
		concept.sctid as sctid,
		concept.hierarchy as hierarchy
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
		not eligibility_criteria.inc_exc = 0 and
		concept.active = 1 
	order by phrase`;
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
	var topic = req.query.topic !== undefined ? 'clinical_trial.topic LIKE \'%' + req.query.topic + '%\' and ' : '';
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
		eligibility_criteria.number, 
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
	order by cmatch.trial 
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
	var topicfrom = req.query.topic !== undefined ? 'clinical_trial, ' : '';
	var topicwhere = req.query.topic !== undefined ? 'clinical_trial.topic LIKE \'%' + req.query.topic + '%\' and clinical_trial.nctid = cmatch.trial and ' : '';
	// var sql_att = `
	// select distinct
	// 	attribute_concept as sctid,
	// 	attribute_fsn as concept,
	// 	count(attribute_concept) as frecuency,
	// 	concept.hierarchy as hierarchy
	// from 
	// 	refinement,
	// 	concept
	// where
	// 	attribute_concept = concept.sctid 
	// group by attribute_concept 
	// order by frecuency`
	// var sql_val = `
	// select distinct
	// 	value_concept as sctid,
	// 	value_fsn as concept,
	// 	count(value_concept) as frecuency,
	// 	concept.hierarchy as hierarchy
	// from 
	// 	refinement,
	// 	concept
	// where
	// 	value_concept = concept.sctid 
	// group by value_concept 
	// order by frecuency`
	var sql_val = `
	select distinct 
		refinement.value_concept as sctid,
		concept.fsn as concept,
		concept.hierarchy as hierarchy,
		count(cmatch.sctid) as frecuency 
	from 
		refinement,
		cmatch,
		${topicfrom}
		concept 
	where 
		refinement.sctid = cmatch.sctid and
		${topicwhere}
		refinement.value_concept = concept.sctid and
		concept.active = 1
	group by value_concept
	;`;
	var sql_att = `
	select distinct 
		refinement.attribute_concept as sctid,
		concept.fsn as concept,
		concept.hierarchy as hierarchy,
		count(cmatch.sctid) as frecuency 
	from 
		refinement,
		cmatch,
		${topicfrom}
		concept 
	where 
		refinement.sctid = cmatch.sctid and
		${topicwhere}
		refinement.attribute_concept = concept.sctid and
		concept.active = 1
	group by attribute_concept
	;`;
	var sql_focus = `
	select distinct
		concept.focus_concept as sctid,
		concept.focus_concept_fsn as concept,
		concept.focus_concept_hierarchy as hierarchy,
    	count(cmatch.sctid) as frecuency
	from
    	cmatch,
		concept,
		${topicfrom}
    	refinement
	where
		refinement.sctid = cmatch.sctid and
		${topicwhere}
    	concept.sctid = cmatch.sctid and
    	concept.active = 1
	group by
		concept.focus_concept
	;`;
	var result = [];
	db.conn.query(sql_val)
		.then(function(values) {
			if(values.length > 0){
				result = result.concat(values);
			}
			return db.conn.query(sql_att);
		})
		.then(function (attributes) {
			if(attributes.length > 0){
				result = result.concat(attributes);
			}
			return db.conn.query(sql_focus);
		})
		.then(function (focus_concepts) {
			if(focus_concepts.length > 0){
				result = result.concat(focus_concepts);
			}
			return Promise.resolve(result);
		})
		.then(function (result) {
			var concepts = result;
			concepts.sort(function (a, b) {
				return b.frecuency - a.frecuency;
			})
			concepts = concepts.slice(0,req.limit);
			res.status(200).json({ concepts: concepts });
		})
		.catch(function (err) {
			console.log(err);
			res.status(400).json({ error: err});
		})
})

module.exports = router;
