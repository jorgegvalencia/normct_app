var mysql = require('promise-mysql');
var config = require('../../../config.json');
var connection = {
	conn: null
}
mysql.createConnection({
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database
    })
    .then(function(conn) {
        connection.conn = conn;
        console.log("Connected to database");
    })
    .catch(function(err) {
        console.error("Error at trying to connect to database:", err);
    })

module.exports = connection;
