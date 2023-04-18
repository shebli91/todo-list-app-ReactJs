import { useState } from "react";
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
      //  Create a task object contains the task and assignee values
      // also set the value of the ke (isDone) to false
      const newTaskObj = {
        task: task,
        assignee: assignee,
        isDone: false,
      };

      // Call the onAddTask callback function with the new task object as an argument
      onAddTask(newTaskObj);

      // set the task and the assignee values back to an empty String
      setTask("");
      setAssignee("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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

function TaskListRender({ tasks }) {
  return (
    <ul>
      {tasks.map((task, index) => (
        <li key={index}>
          <p>Task: {task.task}</p>
          <p>Assignee: {task.assignee}</p>
        </li>
      ))}
    </ul>
  );
}

function TaskSearch({ tasks }) {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.task.toLowerCase().includes(searchText.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        value={searchText}
        onChange={handleSearch}
        placeholder="Search tasks..."
      />
      {/* Render the filtered tasks using TaskListRender component */}
      <TaskListRender tasks={filteredTasks} />
    </div>
  );
}

function App() {
  // Array of tasks
  const [tasks, setTasks] = useState([]);

  // Define the onAddTask callback function
  const handleAddTask = (taskObj) => {
    // Push the new task object to the tasks array using the setTasks function
    setTasks([...tasks, taskObj]);
  };

  return (
    <div>
      {/*render the main form from (TodoForm) component*/}
      <TodoForm onAddTask={handleAddTask} />
      {/* Render the search box  from TaskSearch component */}
      <TaskSearch tasks={tasks} />
      {/*render the tasks form (TaskListRender) component*/}
    </div>
  );
}

export default App;
