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
      {/*render the todo form  from component*/}
      <TodoForm onAddTask={handleAddTask} />
      {/*render the tasks form tasks component*/}
      <TaskListRender tasks={tasks} />
    </div>
  );
}

export default App;
