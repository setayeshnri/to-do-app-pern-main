/*
pool imports a database connection pool from ../config/db, presumably connecting to a PostgreSQL database.
uuidv4 from the uuid module is imported for generating unique identifiers.
bcrypt is imported for hashing passwords securely.
jsonwebtoken is imported for generating and verifying JSON Web Tokens (JWTs).
*/

const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
This defines an asynchronous function named signup exported as part of the module. 
It takes req (request) and res (response) objects as parameters, typically from an Express route handler.
This extracts username and password from the request body and trims any leading or trailing whitespace from the username.
This queries the database to check if the username already exists. It uses parameterized queries to prevent SQL 
injection attacks. The result is stored in isUsernameExist.
If the username already exists in the database, it returns a 400 status with a JSON response indicating that the username is already taken.
This generates a new UUID (Universally Unique Identifier) using uuidv4().

*/

exports.signup = async (req, res) => {
  try {
    let { username, password } = req.body;
    username = username.trim();
    const isUsernameExist = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );
    if (isUsernameExist.rowCount !== 0)
      return res.status(400).json({
        status: "fail",
        message: "Username is already taken",
      });
    const id = uuidv4();

    /*
    This generates a salt using bcrypt.genSaltSync() and hashes the password using bcrypt.hashSync(). 
    The salt strengthens the password hashing process.
    This inserts a new user record into the database with the generated UUID, username, and hashed password.

    */

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await pool.query(
      "INSERT INTO users(id,username,password) VALUES($1,$2,$3)",
      [id, username, hashedPassword]
    );

    /*
    This generates a JWT (JSON Web Token) containing the user's ID (id) and signs it using a secret key (secretkey) 
    with an expiration time of 1 hour.
    This returns a 200 status with a JSON response indicating that the account was successfully created. 
    It includes the JWT token and user information (id and username).
    */

    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      status: "success",
      message: "account created",
      token,
      username,
      id,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create account",
      errorMessage: error.message,
      error,
    });
  }
};

/*
  The login function follows a similar structure, querying the database to validate the username and password, generating a JWT token upon successful login,
   and returning appropriate responses.
*/

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE username=$1", [
      username,
    ]);

    if (user.rowCount === 0)
      return res.status(404).json({
        status: "fail",
        message: "Invalid username or password",
      });

    const checkPassword = bcrypt.compareSync(password, user.rows[0].password);
    if (!checkPassword)
      return res.status(404).json({
        status: "fail",
        message: "Invalid username or password",
      });
    const id = user.rows[0].id;
    const token = jwt.sign({ id }, "secretkey", { expiresIn: "1h" });
    res.status(200).json({
      status: "success",
      message: "login success",
      token,
      user: { id, username: user.rows[0].username },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Failed to log in user",
      errorMessage: error.message,
      error,
    });
  }
};
