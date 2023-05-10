import { useState, useEffect } from "react";

import "./App.css";

function TodoForm({ onAddTask }) {
  const [task, setTask] = useState("");
  const [assignee, setAssignee] = useState("");

  const onTaskChange = (e) => {
    setTask(e.target.value);
  };

  const onAssigneeChange = (e) => {
    setAssignee(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the task and the assignee are not empty
    if (task && assignee) {
      const newTodo = { task, assignee };

      // Make a POST request to the server to add the new task
      fetch("https://nodejs-reactjs-todo-list-app.onrender.com/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      })
        .then((response) => response.json())
        .then((data) => {
          // Invoke the callback function with the new task object returned from the server
          if (onAddTask) {
            onAddTask(data);
          }

          // Reset the form inputs
          setTask("");
          setAssignee("");
        })
        .catch((error) => {
          console.error("Error adding task:", error);
        });
    }
  };

  return (
    <form className="default-box todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="task"
        value={task}
        onChange={onTaskChange}
      ></input>

      <input
        type="text"
        placeholder="assignee"
        value={assignee}
        onChange={onAssigneeChange}
      ></input>
      <button type="submit">Add</button>
    </form>
  );
}

function TaskVisibilityToggle({ showTasks, setShowTasks }) {
  const handleClick = () => {
    setShowTasks(!showTasks);
  };

  return (
    <div className="task-visibility-toggle">
      <button onClick={handleClick}>{showTasks ? "Hide" : "Show"} Tasks</button>
    </div>
  );
}

function TaskListRender({ tasks, onTaskDone }) {
  const handleTaskDone = async (taskId) => {
    // Find the index of the task with the given taskId
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      // Update the isDone property of the task to true
      const updatedTask = { ...tasks[taskIndex], isDone: true };

      try {
        // Send a PUT request to the server to update the task as done
        await fetch(
          `https://nodejs-reactjs-todo-list-app.onrender.com/todos/${taskId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTask),
          }
        );

        // Invoke the callback function with the updated task object
        if (onTaskDone) {
          onTaskDone(taskId, updatedTask);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredTasks = tasks.filter((task) => !task.isDone);

  return (
    <ul className="TaskListRender">
      {filteredTasks.map((task) => (
        <li key={task.id}>
          <p>
            <span>Task: </span> {task.task}
          </p>
          <p>
            <span>Assignee: </span> {task.assignee}
          </p>
          {/* Add "Done" button */}
          <button onClick={() => handleTaskDone(task.id)}>Done</button>
        </li>
      ))}
    </ul>
  );
}

function TaskSearch({ tasks, onTaskDone }) {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (task.task &&
        task.task.toLowerCase().includes(searchText.toLowerCase())) ||
      (task.assignee &&
        task.assignee.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div className="default-box TaskSearch">
      <input
        type="text"
        value={searchText}
        onChange={handleSearch}
        placeholder="Search tasks..."
      />
      {/* Render the filtered tasks using TaskListRender component */}
      <TaskListRender tasks={filteredTasks} onTaskDone={onTaskDone} />
    </div>
  );
}

function TaskCounter({ tasks }) {
  // Filter tasks based on isDone property
  const todoTasks = tasks.filter((task) => !task.isDone);
  const doneTasks = tasks.filter((task) => task.isDone);

  return (
    <div className="default-box TaskCounter">
      <p>Total Tasks : {tasks.length}</p>
      <p>toDo : {todoTasks.length}</p>
      <p>Done : {doneTasks.length}</p>
    </div>
  );
}

function App() {
  // Array of tasks
  const [tasks, setTasks] = useState([]);
  const [showTasks, setShowTasks] = useState(true);

  useEffect(() => {
    // Make a GET request to the server to fetch the tasks
    fetch("https://nodejs-reactjs-todo-list-app.onrender.com/todos")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  const handleAddTask = (newTask) => {
    // Add the new task to the tasks array returned from the server
    setTasks([...tasks, newTask]);
  };

  // Define the onTaskDone callback function
  const handleTaskDone = (taskId, updatedTask) => {
    // Find the index of the task with the given taskId
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      // Update the tasks array with the updated task object
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = updatedTask;
      setTasks(updatedTasks);
    }
  };

  return (
    <div>
      {/*render the main form from (TodoForm) component*/}
      <TodoForm onAddTask={handleAddTask} />
      <TaskVisibilityToggle showTasks={showTasks} setShowTasks={setShowTasks} />
      {/* Render the search box  from TaskSearch component */}
      {showTasks && <TaskSearch tasks={tasks} onTaskDone={handleTaskDone} />}
      {/*render the tasks counter form (TaskCounter) component*/}
      <TaskCounter tasks={tasks} />
    </div>
  );
}

export default App;
