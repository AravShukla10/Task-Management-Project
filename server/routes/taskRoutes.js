const express = require('express');
const { getTasks, createTask, updateTaskStatus, deleteTask } = require('../controllers/taskController');

const router = express.Router();

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTaskStatus);
router.delete('/:id', deleteTask);

module.exports = router;
