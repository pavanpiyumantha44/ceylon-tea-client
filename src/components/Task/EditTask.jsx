import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Calendar,
  User,
  FileText,
  Target,
  X,
  Edit,
  MoreVertical,
  Shovel
} from "lucide-react";
import { Link, useParams } from 'react-router-dom';
import { allAvilableWorkers, allSupervisors } from '../../services/workerService';
import { allTeams } from '../../services/teamSlice';
import { allPlaces } from '../../services/placeService';
import { useDispatch, useSelector } from 'react-redux';
import { validateTaskEntryForm } from '../../utils/validations';
import { ToastContainer, toast } from 'react-toastify';
import { addNewTask, getTask, updateTask } from '../../services/taskService';

const EditTask = ({ onBack }) => {
  const {id} = useParams();
  const {user} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  const currntUser = user?.personId;
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    taskName: '',
    description: '',
    taskType: '',
    taskStatus: '',
    createdBy:currntUser,
    startDateTime: '',
    endDateTime: '',
    assignedSupervisor: '',
    teamId:'',
    workerId:'',
    placeId:'',
  });

  const [items, setItems] = useState([]);
  const [newTask, setNewTask] = useState({
    taskName: '',
    description: '',
    taskType: '',
    taskStatus: '',
    startDateTime: '',
    endDateTime: '',
    createdBy:'',
    assignedSupervisor: '',
    teamId:'',
    workerId:'',
    placeId:'',
  });

  const [showItemForm, setShowItemForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [supervisors,setSupervisors] = useState([]);
  const [workers,setWorkers] = useState([]);
  const [teams,setTeams] = useState([]);
  const [places,setPlaces] = useState([]);

  const taskTypes = ['TEA-PLUCKING', 'CLEANING', 'FERTILIZING', 'TEA-COLLECTING'];
  const taskStatuses = ['ASSIGNED', 'PENDING', 'IN_PROCESS', 'COMPLETED','CANCELLED'];


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
        setTasks(prev => [...prev, { 
          ...newTask, 
          id: Date.now(),
          createdAt: new Date().toISOString()
        }]);
      }
      
      setNewTask({
    taskName:'',
    description: '',
    taskType: '',
    taskStatus: '',
    startDateTime: '',
    endDateTime: '',
    assignedSupervisor: '',
    teamId:'',
    workerId:'',
    placeId:'',
      });
      setShowItemForm(false);
    }
  };

  const editTask = (index) => {
    setNewTask(tasks[index]);
    setEditingTask(index);
    setShowItemForm(true);
  };

  const deleteTask = (index) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async() => {
    // Handle form submission here
    const errors = validateTaskEntryForm(formData);
    if(errors.length>0){
        toast.error(errors[0], {
            position: 'top-center',
          });
    }else{
        console.log(formData);
      const newTaskResponse = await updateTask(id,formData);
      if(newTaskResponse.data.success){
         toast.success("Task updated successfully!", {
                    position: 'top-center',
                  });
      }else{
         toast.error("Failed to update the task!", {
                    position: 'top-center',
                  });
      }
    }
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
  const getAllSupervisors = async()=>{
    try {
      const supervisorsResponse = await allSupervisors();
      setSupervisors(supervisorsResponse.data.supervisors);
    } catch (error) {
      console.log(error.message);
    }
  }
  const getAllWorkers = async()=>{
    try {
      const workersResponse = await allAvilableWorkers();
      setWorkers(workersResponse.data.workers);
    } catch (error) {
      console.log(error.message);
    }
  }
  const getAllTeams = async()=>{
    try {
      const teamsResponse = await allTeams();
      if(teamsResponse){
        setTeams(teamsResponse.data.data);
      }
      
    } catch (error) {
      console.log(error.message);
    }
  }
  const getAllPlaces = async()=>{
    try {
       const placeRsponse = await allPlaces();
      if(placeRsponse){
        setPlaces(placeRsponse.data.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  const fetchTask = async () => {
  const fetchTaskResponse = await getTask(id);

  if (fetchTaskResponse.data.success) {
    const task = fetchTaskResponse.data.data;
    setFormData({
      taskName: task.taskName || '',
      description: task.description || '',
      taskType: task.taskType || '',
      taskStatus: task.taskStatus || '',
      createdBy: task.createdBy || currntUser,
      startDateTime: task.startDateTime ? task.startDateTime.slice(0, 10) : '',
      endDateTime: task.endDateTime ? task.endDateTime.slice(0, 10) : '',
      assignedSupervisor: task.assignedSupervisor || '',
      teamId: task.teamId || '',
      workerId: task.workerId || '',
      placeId: task.placeId || '',
    });

  }
};


useEffect(()=>{
  fetchTask();
  getAllSupervisors();
  getAllWorkers();
  getAllTeams();
  getAllPlaces();
},[])
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to={'/dashboard/tasks'}
          onClick={onBack}
          className="hover:text-green-600 transition-colors font-medium cursor-pointer"
        >
          Tasks
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Edit Task</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to={'/dashboard/tasks'}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
              <p className="text-gray-600 mt-1">Fill in the details to update the task</p>
            </div>
          </div>
          <div className="hidden md:block lg:flex items-center space-x-3">
            <button
              onClick={handleUpdate}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
            >
              <Save className="h-4 w-4 mr-2" />
              Update Task
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <ToastContainer autoClose={2000} />
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
                <span>Task Details</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tasks'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Shovel className="h-5 w-5" />
                <span>Task Items</span>
                {items.length > 0 && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {items.length}
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
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <input
                      type="text"
                      value={formData.createdBy}
                      readOnly
                      hidden
                      placeholder="Created By"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={formData.taskName}
                      onChange={(e) => handleInputChange('taskName', e.target.value)}
                      placeholder="Enter a clear, descriptive title for your task"
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
                      placeholder="Provide detailed information about your task..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Type *
                    </label>
                    <select
                      value={formData.taskType}
                      onChange={(e) => handleInputChange('taskType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Task Type</option>
                      {taskTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Status *
                    </label>
                    <select
                      value={formData.taskStatus}
                      onChange={(e) => handleInputChange('taskStatus', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Task Status</option>
                      {taskStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDateTime}
                      onChange={(e) => handleInputChange('startDateTime', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Place
                    </label>
                    <select
                      value={formData.placeId}
                      onChange={(e) => handleInputChange('placeId', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Place</option>
                      {places.map(place => (
                        <option key={place.placeId} value={place.placeId}>{place.placeCode}</option>
                      ))}
                    </select>
                  </div>
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supervisor
                    </label>
                    <select
                      value={formData.assignedSupervisor}
                      onChange={(e) => handleInputChange('assignedSupervisor', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Supervisor</option>
                      {supervisors.map(supv => (
                        <option key={supv.id} value={supv.personId}>{supv.personCode}-{supv.firstName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Team
                    </label>
                    <select
                      value={formData.teamId}
                      onChange={(e) => handleInputChange('teamId', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Team</option>
                      {teams.map(team => (
                        <option key={team.teamId} value={team.teamId}>{team.description}</option>
                      ))}
                    </select>
                  </div>
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Worker
                    </label>
                    <select
                      value={formData.workerId}
                      onChange={(e) => handleInputChange('workerId', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Worker</option>
                      {workers.map(worker => (
                        <option key={worker.personId} value={worker.personId}>{worker.personCode} - {worker.firstName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex md:hidden lg:hidden items-center space-x-3">    
                <button
                  onClick={handleUpdate}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Update Task
                </button>
              </div>    
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-6">
              {/* Tasks Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Task Items</h3>
                  <p className="text-gray-600 mt-1">Add required items to the task</p>
                </div>
                <div className="flex items-center space-x-3">
                  {items.length > 0 && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
                          setItems([]);
                        }
                      }}
                      className="flex items-center px-4 py-2 text-red-700 bg-red-100 rounded-xl hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Items
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowItemForm(true);
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
                    Add Item
                  </button>
                </div>
              </div>

              {/* Task Form */}
              {showItemForm && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">
                      {editingTask !== null ? 'Edit Task' : 'Add New Task'}
                    </h4>
                    <button
                      onClick={() => {
                        setShowItemForm(false);
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
                        {/* {workers.map(employee => (
                          <option key={employee} value={employee}>{employee}</option>
                        ))} */}
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
                        {/* {priorities.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))} */}
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
                        setShowItemForm(false);
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
              {items.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{items.title}</h4>
                            {getPriorityBadge(items.priority)}
                            {getStatusBadge(items.status)}
                          </div>
                          {items.description && (
                            <p className="text-gray-600 text-sm mb-3">{items.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {items.assignedTo && (
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {items.assignedTo.split(' - ')[0]}
                              </div>
                            )}
                            {items.dueDate && (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(items.dueDate).toLocaleDateString()}
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
                    onClick={() => setShowItemForm(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Task Items
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

export default EditTask;   