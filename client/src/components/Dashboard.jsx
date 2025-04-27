import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useTasks from '../hooks/useTasks';
import './styles/Dashboard.css';

function Dashboard() {
  const { tasks, addTask, toggleStatus, deleteTask } = useTasks();
  const [filter, setFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [viewTask, setViewTask] = useState(null);
  const [deleteTaskConfirmation, setDeleteTaskConfirmation] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const k = await addTask(title.trim(), description, priority);
    if (k){
      toast.success('Task added successfully!');
      setTitle('');
      setDescription('');
      setPriority('Medium');
    } else {
      toast.error('Task with same title already exists or Some error occurred');
    }
  };
  

  const handleDelete = (taskId) => {
    setDeleteTaskConfirmation(taskId);
  };

  const confirmDelete = () => {
    if (deleteTaskConfirmation) {
      deleteTask(deleteTaskConfirmation); // Ensure no alert here
      toast.error('Task deleted successfully!');
      setDeleteTaskConfirmation(null); // Reset the confirmation state
    }
  };  

  const cancelDelete = () => {
    setDeleteTaskConfirmation(null);
  };

  const truncateDescription = (desc, maxLength = 100) => {
    if (desc.length > maxLength) {
      return desc.substring(0, maxLength) + '...';
    }
    return desc;
  };

  const priorityOrder = { High: 1, Medium: 2, Low: 3 };

  const filtered = tasks
    .filter(t => {
      if (filter === 'Active') return t.status === 'incomplete';
      if (filter === 'Completed') return t.status === 'complete';
      return true;
    })
    .filter(t => {
      if (priorityFilter === 'All') return true;
      return t.priority === priorityFilter;
    })
    .sort((a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4));

  return (
    <div>
    <div className="dashboard-container">      

      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Tasks</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAdd} className="task-form">
        <h2>Add New Task</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {/* Filters */}
      <div className="filters-container">
        <div className="status-filters">
          {['All', 'Active', 'Completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-button ${filter === f ? 'active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="priority-filter">
          <button
            onClick={() => setPriorityDropdownOpen(prev => !prev)}
            className="priority-filter-button"
          >
            Priority: {priorityFilter} ⬇️
          </button>

          {priorityDropdownOpen && (
            <div className="priority-dropdown">
              {['All', 'High', 'Medium', 'Low'].map(p => (
                <div
                  key={p}
                  onClick={() => {
                    setPriorityFilter(p);
                    setPriorityDropdownOpen(false);
                  }}
                  className="priority-dropdown-item"
                >
                  {p}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {filtered.map(task => (
          <li key={task._id} className="task-item">
            <div className="task-details">
              <h3 className={`task-title`}>{task.title}</h3>
              <p className="task-desc">{truncateDescription(task.description)}</p>
              <p className="task-meta">
                Priority: <span>{task.priority}</span> | Created: {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="task-buttons">
              <button
                onClick={() => toggleStatus(task._id, task.status)}
                className="task-button complete"
              >
                {task.status === 'complete' ? 'Undo' : 'Complete'}
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="task-button delete"
              >
                Delete
              </button>
              <button
                onClick={() => setViewTask(task)}
                className="task-button view"
              >
                View
              </button>
            </div>

            {/* Status Icon */}
            <div className="task-status">
                <p>Status : </p>
              {task.status === 'complete' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="status-icon">
                  <circle cx="12" cy="12" r="10" stroke="green" strokeWidth="2" fill="none" />
                  <path d="M9 12l2 2 4-4" stroke="green" strokeWidth="2" fill="none" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="status-icon">
                  <circle cx="12" cy="12" r="10" stroke="orange" strokeWidth="2" fill="none" />
                  <path d="M12 6v6l4 2" stroke="orange" strokeWidth="2" fill="none" />
                </svg>

              )}
            </div>
          </li>
        ))}

        {filtered.length === 0 && (
          <li className="no-tasks">No tasks to show.</li>
        )}
      </ul>

      {/* View Task Modal */}
      
    </div>
    <div className='toast' style={{position:'sticky'}}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      </div>
    {viewTask && (
        <div className="view-task-overlay">
          <div className="view-task-card">
            <h2>{viewTask.title}</h2>
            <p><strong>Description:</strong> {viewTask.description || 'No description provided.'}</p>
            <p><strong>Priority:</strong> {viewTask.priority}</p>
            <p><strong>Status:</strong> {viewTask.status}</p>
            <p><strong>Created:</strong> {new Date(viewTask.createdAt).toLocaleDateString()}</p>
            <button onClick={() => setViewTask(null)} className="close-button">Close</button>
          </div>
        </div>
      )}

      {/* Delete Task Confirmation Modal */}
      {deleteTaskConfirmation && (
        <div className="view-task-overlay">
          <div className="view-task-card">
            <h2>Are you sure you want to delete this task?</h2>
            <div className="task-buttons">
              <button onClick={confirmDelete} className="task-button delete">
                Yes, Delete
              </button>
              <button onClick={cancelDelete} className="task-button complete">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
