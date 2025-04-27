import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load tasks');
    }
  }, [token]);

  const addTask = useCallback(async (title, description, priority) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/tasks',
        { title, description, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 201 ) {  
        setTasks(prev => [...prev, res.data]);
        return true;
      } else {
        return false;
      }
      
    } catch (err) {
      console.error(err);
     // alert('Failed to add task');
     return false
    }
  }, [token]);

  const toggleStatus = useCallback(async (id, currentStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { status: currentStatus === 'complete' ? 'incomplete' : 'complete' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev => prev.map(t => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  }, [token]);

  const deleteTask = useCallback(async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete task');
    }
  }, [token]);  

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    addTask,
    toggleStatus,
    deleteTask,
  };
}
