var mysql = require('promise-mysql');
var connection = {
	conn: null
}
mysql.createConnection({
        host: 'localhost',
        user: 'dbuser',
        password: '1234',
        database: 'normdb'
    })
    .then(function(conn) {
        connection.conn = conn;
        console.log("Connected to database");
    })
    .catch(function(err) {
        console.error("Error at trying to connect to database:", err);
    })

module.exports = connection;
