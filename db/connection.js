const mySQL = require('mysql2');
const util = require('util')


const db = mySQL.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Toyotasupra94',
    database: 'employee'
});

db.query = util.promisify(db.query)



module.exports = db;