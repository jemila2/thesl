import { useState, useEffect } from 'react';
import { FaTasks, FaUserCheck, FaCalendarDay } from 'react-icons/fa';

const TaskAssignment = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium'
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/employees').then(res => res.json()),
      fetch('/api/tasks').then(res => res.json())
    ]).then(([empData, taskData]) => {
      setEmployees(empData);
      setTasks(taskData);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
    const data = await res.json();
    setTasks([...tasks, data]);
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      priority: 'medium'
    });
  };

  const handleComplete = async (id) => {
    await fetch(`/tasks/${id}/complete`, { method: 'PUT' });
    setTasks(tasks.map(task => 
      task._id === id ? {...task, status: 'completed'} : task
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaTasks /> Task Assignment
      </h2>
      
      {/* New Task Form */}
      <div className="mb-8 p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-4">Assign New Task</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              required
            />
          </div>
          
          <div>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaUserCheck className="absolute left-3 top-3 text-gray-400" />
              <select
                className="w-full pl-10 pr-3 py-2 border rounded-md"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                required
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.position})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <FaCalendarDay className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-3 py-2 border rounded-md"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                required
              />
            </div>
            
            <div>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Assign Task
          </button>
        </form>
      </div>
      
      {/* Tasks List */}
      <div>
        <h3 className="text-lg font-medium mb-4">Current Tasks</h3>
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task._id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>Assigned to: {task.assignedToName}</span>
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    <span className={`${
                      task.priority === 'high' ? 'text-red-600' :
                      task.priority === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {task.priority} priority
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.status}
                  </span>
                  
                  {task.status === 'pending' && (
                    <button 
                      onClick={() => handleComplete(task._id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaCheck />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskAssignment;