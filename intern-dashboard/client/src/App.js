
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/dashboard', {
        headers: { Authorization: token },
      }).then(res => {
        setUser(res.data.user);
        setTasks(res.data.tasks);
      });
    }
  }, [token]);

  const login = async () => {
    const res = await axios.post('http://localhost:5000/api/login', {
      email: 'intern@example.com',
      password: 'password123'
    });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const addTask = async () => {
    const res = await axios.post('http://localhost:5000/api/tasks', { title }, {
      headers: { Authorization: token },
    });
    setTasks([...tasks, res.data]);
    setTitle('');
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: token },
    });
    setTasks(tasks.filter(t => t._id !== id));
  };

  if (!token) return <button onClick={login}>Login as Intern</button>;

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      <div className="my-4">
        <input className="border p-2 mr-2" value={title} onChange={e => setTitle(e.target.value)} placeholder="New Task" />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task._id} className="flex justify-between w-64">
            <span>{task.title}</span>
            <button onClick={() => deleteTask(task._id)} className="text-red-500">X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
