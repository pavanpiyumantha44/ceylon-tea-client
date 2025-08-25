import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Calendar,
  User,
  Tag,
  AlertTriangle,
  FileText,
  Clock,
  Target,
  Users,
  Paperclip,
  X,
  CheckCircle,
  Edit,
  MoreVertical
} from "lucide-react";
import { Link } from 'react-router-dom';

const CreateRequest = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    department: '',
    dueDate: '',
    assignedTo: '',
    attachments: []
  });

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Not Started'
  });

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const categories = ['Maintenance', 'HR', 'Procurement', 'Training', 'IT Support', 'Finance', 'Operations'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const departments = ['Production', 'Quality Control', 'Packaging', 'Maintenance', 'Administration', 'HR'];
  const employees = [
    'Mike Fernando - Maintenance Lead',
    'Lisa Kumar - HR Manager', 
    'Anna Rodriguez - Procurement Officer',
    'Robert Taylor - Training Coordinator',
    'Sarah Johnson - IT Support',
    'David Chen - Finance Manager'
  ];

  const taskStatuses = ['Not Started', 'In Progress', 'Completed', 'On Hold'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTaskInputChange = (field, value) => {
    setNewTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      if (editingTask !== null) {
        // Update existing task
        setTasks(prev => prev.map((task, index) => 
          index === editingTask ? { ...newTask, id: task.id } : task
        ));
        setEditingTask(null);
      } else {
        // Add new task
        setTasks(prev => [...prev, { 
          ...newTask, 
          id: Date.now(),
          createdAt: new Date().toISOString()
        }]);
      }
      
      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'Medium',
        status: 'Not Started'
      });
      setShowTaskForm(false);
    }
  };

  const editTask = (index) => {
    setNewTask(tasks[index]);
    setEditingTask(index);
    setShowTaskForm(true);
  };

  const deleteTask = (index) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log('Request Data:', formData);
    console.log('Tasks:', tasks);
    // You would typically send this to your API
    alert('Request created successfully!');
  };

  const getPriorityBadge = (priority) => {
    const priorityStyles = {
      'Low': 'bg-gray-100 text-gray-800 border-gray-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'High': 'bg-orange-100 text-orange-800 border-orange-200',
      'Critical': 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityStyles[priority]}`}>
        {priority}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Not Started': 'bg-gray-100 text-gray-800 border-gray-200',
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'On Hold': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to={'/dashboard/requests'}
          onClick={onBack}
          className="hover:text-green-600 transition-colors font-medium cursor-pointer"
        >
          Requests
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Create New Request</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to={'/dashboard/requests'}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Request</h1>
              <p className="text-gray-600 mt-1">Fill in the details to submit a new request</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this request? All data will be lost.')) {
                  // Clear all form data
                  setFormData({
                    title: '',
                    description: '',
                    category: '',
                    priority: 'Medium',
                    department: '',
                    dueDate: '',
                    assignedTo: '',
                    attachments: []
                  });
                  setTasks([]);
                  // Optionally navigate back or show success message
                  alert('Request deleted successfully!');
                  onBack();
                }
              }}
              className="px-4 py-2 text-red-700 bg-red-100 rounded-xl hover:bg-red-200 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
            <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              Save Draft
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
            >
              <Save className="h-4 w-4 mr-2" />
              Submit Request
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'details'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Request Details</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tasks'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Tasks</span>
                {tasks.length > 0 && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {tasks.length}
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter a clear, descriptive title for your request"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Provide detailed information about your request..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority *
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign To
                    </label>
                    <select
                      value={formData.assignedTo}
                      onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Assignee</option>
                      {employees.map(employee => (
                        <option key={employee} value={employee}>{employee}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
                  <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Drop files here or click to browse</p>
                  <p className="text-sm text-gray-500">Supports: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)</p>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      // Handle file upload
                      console.log('Files:', e.target.files);
                    }}
                  />
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Choose Files
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {/* Tasks Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Request Tasks</h3>
                  <p className="text-gray-600 mt-1">Break down your request into manageable tasks</p>
                </div>
                <div className="flex items-center space-x-3">
                  {tasks.length > 0 && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
                          setTasks([]);
                        }
                      }}
                      className="flex items-center px-4 py-2 text-red-700 bg-red-100 rounded-xl hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Tasks
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowTaskForm(true);
                      setEditingTask(null);
                      setNewTask({
                        title: '',
                        description: '',
                        assignedTo: '',
                        dueDate: '',
                        priority: 'Medium',
                        status: 'Not Started'
                      });
                    }}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </button>
                </div>
              </div>

              {/* Task Form */}
              {showTaskForm && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">
                      {editingTask !== null ? 'Edit Task' : 'Add New Task'}
                    </h4>
                    <button
                      onClick={() => {
                        setShowTaskForm(false);
                        setEditingTask(null);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => handleTaskInputChange('title', e.target.value)}
                        placeholder="Enter task title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) => handleTaskInputChange('description', e.target.value)}
                        placeholder="Task description..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                      <select
                        value={newTask.assignedTo}
                        onChange={(e) => handleTaskInputChange('assignedTo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select Assignee</option>
                        {employees.map(employee => (
                          <option key={employee} value={employee}>{employee}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => handleTaskInputChange('dueDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => handleTaskInputChange('priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {priorities.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={newTask.status}
                        onChange={(e) => handleTaskInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {taskStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => {
                        setShowTaskForm(false);
                        setEditingTask(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addTask}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {editingTask !== null ? 'Update Task' : 'Add Task'}
                    </button>
                  </div>
                </div>
              )}

              {/* Tasks List */}
              {tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{task.title}</h4>
                            {getPriorityBadge(task.priority)}
                            {getStatusBadge(task.status)}
                          </div>
                          {task.description && (
                            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {task.assignedTo && (
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {task.assignedTo.split(' - ')[0]}
                              </div>
                            )}
                            {task.dueDate && (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => editTask(index)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Task"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this task?')) {
                                deleteTask(index);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No tasks added yet</h4>
                  <p className="text-gray-600 mb-4">Break down your request into specific tasks to track progress better</p>
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Your First Task
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;   