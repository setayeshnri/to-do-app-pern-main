const express = require("express");
const todoController = require("../controllers/todo.contoller");

const router = express.Router();

/*
This block of code defines routes for the "/" endpoint.
A GET request to "/" will execute the getAllTodos function from the todoController.
A POST request to "/" will execute the createTodo function from the todoController.
*/
router
  .route("/")
  .get(todoController.getAllTodos)
  .post(todoController.createTodo);

/*
This block of code defines routes for the "/:id" endpoint. ":id" is a route parameter representing the ID of a specific todo.
A GET request to "/:id" will execute the getTodo function from the todoController.
A PATCH request to "/:id" will execute the updateTodo function from the todoController.
A DELETE request to "/:id" will execute the deleteTodo function from the todoController.
*/
router
  .route("/:id")
  .get(todoController.getTodo)
  .patch(todoController.updateTodo)
  .delete(todoController.deleteTodo);

/*
This line defines a route for the "/users/:id" endpoint. ":id" is a route parameter representing the ID of a specific user.
A GET request to "/users/:id" will execute the getUserTodos function from the todoController.
*/
router.get("/users/:id", todoController.getUserTodos);

module.exports = router;

