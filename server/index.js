require("dotenv").config();
const express = require("express");
const cors = require("cors");

/*
These lines import the route handlers for todo-related endpoints and authentication-related endpoints respectively. These handlers are defined in 
separate files (todo.routes.js and auth.routes.js).
*/

const todoRoutes = require("./routes/todo.routes");
const authRoutes = require("./routes/auth.routes");
const app = express();

//middleware
/*
These lines set up middleware for the Express application:
cors() is used to enable CORS for all routes.
express.json() is used to parse incoming JSON requests.
*/
app.use(cors());
app.use(express.json());

//routes
/*
These lines define the routes for the Express application:
Requests to paths starting with "/api/auth" will be handled by the authRoutes middleware.
Requests to paths starting with "/api/todos" will be handled by the todoRoutes middleware.
*/
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

/*
This block of code starts the Express server, listening on port 5001.
When the server starts, it prints a message to the console indicating 
the URL where the server is running.
*/

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
