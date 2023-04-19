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

    // Generate a unique id for the new task
    const taskId = new Date().getTime().toString();

    // Check if the task and the assignee are not empty
    if (task && assignee) {
      //  Create a task object contains the task and assignee values
      // also set the value of the ke (isDone) to false
      const newTaskObj = {
        id: taskId,
        task: task,
        assignee: assignee,
        isDone: false,
      };

      // Call the onAddTask callback function with the new task object as an argument
      if (onAddTask) {
        onAddTask(newTaskObj);
      }

      // set the task and the assignee values back to an empty String
      setTask("");
      setAssignee("");
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
  const handleTaskDone = (taskId) => {
    // Find the index of the task with the given taskId
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      // Update the isDone property of the task to true
      const updatedTask = { ...tasks[taskIndex], isDone: true };
      // Invoke the callback function with the updated task object
      if (onTaskDone) {
        onTaskDone(taskId, updatedTask);
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
      task.task.toLowerCase().includes(searchText.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchText.toLowerCase())
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

  // Define the onAddTask callback function
  const handleAddTask = (taskObj) => {
    // Push the new task object to the tasks array using the setTasks function
    setTasks([...tasks, taskObj]);
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
