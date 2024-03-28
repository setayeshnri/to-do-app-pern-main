/*
pool imports a database connection pool from ../config/db, presumably connecting to a PostgreSQL database.
uuidv4 from the uuid module is imported for generating unique identifiers.
*/

const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

/*
  This defines an asynchronous function createTodo exported as part of the module. It takes req (request) and res (response) objects as parameters, typically from an Express route handler.
  It extracts user_id, title, progress, and date from the request body.
*/

exports.createTodo = async (req, res) => {
  try {
    let { user_id, title, progress, date } = req.body;

    /*
    This generates a new UUID (Universally Unique Identifier) using uuidv4() 
    and trims any leading or trailing whitespace from the title.
    */
    const id = uuidv4();
    title = title.trim();

    /*
    This SQL query string defines an INSERT statement to add a new record to the todos table, returning all columns (*). 
    It uses parameterized queries for security against SQL injection attacks.
    */

    const sql =
      "INSERT INTO todos (id,user_id,title,progress,date) VALUES($1,$2,$3,$4,$5) RETURNING *";

    /*
    This executes the SQL query with the parameters using the database connection pool (pool). 
    It inserts a new todo into the database.
    */

    const newTodo = await pool.query(sql, [id, user_id, title, progress, date]);
    res.status(201).json({
      status: "success",
      message: "Todo created",
      data: { todo: newTodo.rows[0] },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create todo",
      errorMessage: error.message,
      error,
    });
  }
};

/*
The updateTodo, deleteTodo, getAllTodos, getTodo, and getUserTodos 
functions follow similar structures, performing CRUD (Create, Read, Update, Delete) 
operations on the todos table in the database and handling success and error responses accordingly.
*/

exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    let { user_id, title, progress, date } = req.body;
    title = title.trim();
    const updatedTodo = await pool.query(
      "UPDATE todos SET user_id=$1, title=$2,progress=$3,date=$4 WHERE id=$5",
      [user_id, title, progress, date, id]
    );
    res.status(200).json({
      status: "success",
      message: "Todo updated",
      data: { todo: updatedTodo.rows[0] },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update todo",
      errorMessage: error.message,
      error,
    });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todos WHERE id=$1", [id]);
    res.status(200).json({
      status: "success",
      message: "Todo deleted",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete todo",
      errorMessage: error.message,
      error,
    });
  }
};

exports.getAllTodos = async (req, res) => {
  try {
    const todos = await pool.query("SELECT * FROM todos");
    res.status(200).json({
      staus: "success",
      result: todos.rowCount,
      data: { todos: todos.rows },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to get todos",
      errorMessage: error.message,
      error,
    });
  }
};

exports.getTodo = async (req, res) => {
  try {
    let { id } = req.params;
    // id = parseInt(id);
    const todo = await pool.query("SELECT * FROM todos WHERE id=$1", [id]);
    if (todo.rowCount === 0) {
      return res.status(404).json({
        staus: "fail",
        message: `Todo with id ${id} not found`,
      });
    }
    res.status(200).json({
      staus: "success",
      data: { todo: todo.rows[0] },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to get a todo",
      errorMessage: error.message,
      error,
    });
  }
};

exports.getUserTodos = async (req, res) => {
  try {
    const { id } = req.params;
    const todos = await pool.query("SELECT * FROM todos WHERE user_id=$1", [
      id,
    ]);
    res.status(200).json({
      staus: "success",
      result: todos.rowCount,
      data: { todos: todos.rows },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to get todos",
      errorMessage: error.message,
      error,
    });
  }
};
