const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key';

const authenticate = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error('Unauthorized');

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, SECRET_KEY);

  return decoded.userId;
};

exports.getTasks = async (req, res) => {
  try {
    const userId = authenticate(req);
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const userId = authenticate(req);
    const { title, description, priority } = req.body;

    const existing = await Task.findOne({ userId, title });
    if (existing) {
      return res.status(400).json({ message: 'You already have a task with that title.' });
    }

    const task = new Task({ title, description, priority, userId });
    await task.save();
    res.status(201).json(task);

  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.title) {
      return res.status(400).json({ message: 'You already have a task with that title.' });
    }
    res.status(400).json({ message: error.message });
  }
};



exports.updateTaskStatus = async (req, res) => {
  try {
    const userId = authenticate(req);
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { status },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json(task);

  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const userId = authenticate(req);
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task deleted successfully' });

  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
