// This line imports the Pool class from the pg module.
// pg is a popular Node.js module for interacting with PostgreSQL databases.

const Pool = require("pg").Pool;
const creds = require("../creds.json");
// This creates a new instance of the Pool class, which represents a pool
// of PostgreSQL database connections.

const pool = new Pool({
  user: "group4",
  password: creds.pass,
  port: 5432,
  database: "group4",
  host: "34.79.81.42",
});

module.exports = pool;
// This line exports the pool object so that other parts of the application can import it and use it to execute
//SQL queries against the PostgreSQL database.

/*
user: Specifies the username to connect to the database (group4 in this case).
password: Specifies the password for the user. 
port: Specifies the port on which the PostgreSQL server is running (default is usually 5432).
database: Specifies the name of the database to connect to (group4 in this case).
host: Specifies the hostname or IP address of the PostgreSQL server (34.79.81.42 in this case).
*/
