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
    let { title, progress, date } = req.body;

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

    const newTodo = await pool.query(sql, [
      id,
      req.userId,
      title,
      progress,
      date,
    ]);
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
    let { title, progress, date } = req.body;

    const result = await pool.query("SELECT * FROM todos WHERE id=$1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: "fail",
        message: `Todo with id ${id} not found`,
      });
    }

    const todo = result.rows[0];

    if (req.userId !== todo.user_id) {
      res.status(403).send();
    }

    title = title.trim();
    const updatedTodo = await pool.query(
      "UPDATE todos SET title=$1,progress=$2,date=$3 WHERE id=$4",
      [title, progress, date, id]
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

    const result = await pool.query("SELECT * FROM todos WHERE id=$1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: "fail",
        message: `Todo with id ${id} not found`,
      });
    }

    const todo = result.rows[0];

    if (req.userId !== todo.user_id) {
      res.status(403).send();
    }

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
    // TODO Remove this endpoint - not safe - not used in client either
    const todos = await pool.query("SELECT * FROM todos");
    res.status(200).json({
      status: "success",
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
    const result = await pool.query("SELECT * FROM todos WHERE id=$1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({
        status: "fail",
        message: `Todo with id ${id} not found`,
      });
    }

    const todo = result.rows[0];
    if (req.userId !== todo.user_id) {
      res.status(403).send();
    }

    res.status(200).json({
      status: "success",
      data: { todo },
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

    if (id !== req.userId) {
      res.status(403).send();
    }

    const todos = await pool.query("SELECT * FROM todos WHERE user_id=$1", [
      id,
    ]);
    res.status(200).json({
      status: "success",
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
