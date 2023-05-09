const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

let todos = [];

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const { task, assignee } = req.body;
  const taskId = new Date().getTime().toString();
  const newTodo = {
    id: taskId,
    task: task,
    assignee: assignee,
    isDone: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;

  const todo = todos.find((todo) => todo.id === Number(id));

  if (!todo) {
    res.status(404).json({ error: `Todo with id ${id} not found` });
    return;
  }

  todo.isDone = true;

  res.status(200).json(todo);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
