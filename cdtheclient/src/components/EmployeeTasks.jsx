
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Checkbox, 
  TextField, 
  Button,
  IconButton,
  Paper,
  Chip,
  Divider,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  FilterList,
  Today,
  Flag,
  CheckCircle
} from '@mui/icons-material';

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Process new orders', completed: false, priority: 'medium', dueDate: '2023-06-15' },
    { id: 2, title: 'Follow up with customer ABC', completed: true, priority: 'high', dueDate: '2023-06-10' },
    { id: 3, title: 'Update inventory records', completed: false, priority: 'low', dueDate: '2023-06-20' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [activeTab, setActiveTab] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        title: newTask,
        completed: false,
        priority: newTaskPriority,
        dueDate: new Date().toISOString().split('T')[0]
      }]);
      setNewTask('');
      setNewTaskPriority('medium');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditTaskText(task.title);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, title: editTaskText } : task
    ));
    setEditingTask(null);
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'completed') return task.completed;
    if (activeTab === 'pending') return !task.completed;
    if (activeTab === 'high') return task.priority === 'high';
    return true;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        My Tasks
        <Chip 
          label={`${tasks.filter(t => !t.completed).length} pending`} 
          color="primary" 
          size="small" 
          sx={{ ml: 2 }}
        />
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task"
            sx={{ flexGrow: 1 }}
          />
          <Button 
            variant="contained" 
            onClick={addTask}
            startIcon={<Add />}
            disabled={!newTask.trim()}
          >
            Add
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['low', 'medium', 'high'].map(priority => (
            <Chip
              key={priority}
              label={priority}
              color={getPriorityColor(priority)}
              variant={newTaskPriority === priority ? 'filled' : 'outlined'}
              onClick={() => setNewTaskPriority(priority)}
              size="small"
            />
          ))}
        </Box>
      </Paper>

      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="All" value="all" />
        <Tab 
          label={
            <Badge badgeContent={tasks.filter(t => !t.completed).length} color="primary">
              Pending
            </Badge>
          } 
          value="pending" 
        />
        <Tab label="Completed" value="completed" />
        <Tab label="High Priority" value="high" />
      </Tabs>
      <Divider sx={{ mb: 2 }} />

      <List sx={{ width: '100%' }}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <Paper 
              key={task.id} 
              elevation={2} 
              sx={{ mb: 1, opacity: task.completed ? 0.8 : 1 }}
            >
              <ListItem 
                secondaryAction={
                  <Box sx={{ display: 'flex' }}>
                    {editingTask === task.id ? (
                      <>
                        <IconButton onClick={() => saveEdit(task.id)} color="primary">
                          <CheckCircle />
                        </IconButton>
                        <IconButton onClick={cancelEdit} color="error">
                          <Flag />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => startEditing(task)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => deleteTask(task.id)} color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </Box>
                }
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  color="primary"
                />
                {editingTask === task.id ? (
                  <TextField
                    fullWidth
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                    size="small"
                    autoFocus
                  />
                ) : (
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography 
                          sx={{ 
                            textDecoration: task.completed ? 'line-through' : 'none',
                            mr: 1
                          }}
                        >
                          {task.title}
                        </Typography>
                        <Chip 
                          label={task.priority} 
                          size="small" 
                          color={getPriorityColor(task.priority)}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Today fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                        <Typography variant="caption">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                )}
              </ListItem>
            </Paper>
          ))
        ) : (
          <Typography variant="body1" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            No tasks found in this category
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default EmployeeTasks;