import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // Filter: 'all', 'active', 'completed'

  // Fetch tasks when the app loads
  useEffect(() => {
    axios.get('https://full-stack-todo-backend-noyv.onrender.com/read-task') // Updated API URL
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  // Add a new task
  const handleAddTask = () => {
    if (!newTask.trim()) return; // Prevent adding empty tasks
    axios.post('https://full-stack-todo-backend-noyv.onrender.com/new-task', { task: newTask }) // Updated API URL
      .then((response) => {
        setTasks(response.data);
        setNewTask('');
      })
      .catch((error) => console.error('Error adding task:', error));
  };

  // Mark task as completed
  const handleCompleteTask = (id) => {
    axios.post('https://full-stack-todo-backend-noyv.onrender.com/complete-task', { id }) // Updated API URL
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error marking task as completed:', error));
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    axios.post('https://full-stack-todo-backend-noyv.onrender.com/delete-task', { id }) // Updated API URL
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error deleting task:', error));
  };

  // Filter tasks based on status
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return task.status === 'active';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  return (
    <div className="app-container">
      <h1 className="title">Todo App</h1>

      {/* Input and Add Button */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      {/* Task Filters */}
      <div className="filters">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>Active</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.status === 'completed' ? 'completed' : ''}>
            <div className="task-content">
              <span>{task.task}</span>
              <div className="task-time">Created At: {formatDate(task.createdAt)}</div>
            </div>
            <div className="task-actions">
              {task.status === 'active' && (
                <button onClick={() => handleCompleteTask(task.id)}>Complete</button>
              )}
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
