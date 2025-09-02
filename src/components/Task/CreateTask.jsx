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
import { Link } from 'react-router-dom';
import { allAvilableWorkers, allSupervisors } from '../../services/workerService';
import { allTeams } from '../../services/teamSlice';
import { allPlaces } from '../../services/placeService';
import { useDispatch, useSelector } from 'react-redux';
import { validateTaskEntryForm } from '../../utils/validations';
import { ToastContainer, toast } from 'react-toastify';
import { addNewTask } from '../../services/taskService';
import { getStockItems } from '../../services/stockService';

const CreateRequest = ({ onBack }) => {
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
    items:'',
  });

  const [items, setItems] = useState([]);
  const [taskItem, setTaskItem] = useState({
    itemId: '',
    quantity: '',
  });

  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [supervisors,setSupervisors] = useState([]);
  const [workers,setWorkers] = useState([]);
  const [teams,setTeams] = useState([]);
  const [places,setPlaces] = useState([]);
  const [stockItems,setStockItems] = useState([]);

  const taskTypes = ['TEA-PLUCKING', 'CLEANING', 'FERTILIZING', 'TEA-COLLECTING'];
  const taskStatuses = ['ASSIGNED', 'PENDING', 'IN_PROCESS', 'COMPLETED','CANCELLED'];


  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTaskInputChange = (field, value) => {
    setTaskItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItem = () => {
    if (taskItem.itemId) {
      if (editingItem !== null) {
        // Update existing task
        setItems(prev => prev.map((task, index) => 
          index === editingItem ? { ...taskItem, id: task.id } : task
        ));
        setEditingItem(null);
      } else {
        setItems(prev => [...prev, { 
          ...taskItem, 
          id: Date.now(),
          createdAt: new Date().toISOString()
        }]);
      }
      
      setTaskItem({
        itemId: '',
        quantity: '',
      });
      setShowItemForm(false);
    }
  };

  const editItem = (index) => {
    setTaskItem(items[index]);
    setEditingItem(index);
    setShowItemForm(true);
  };

  const deleteItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async() => {
     const updatedFormData = {...formData,items: items,};
    const errors = validateTaskEntryForm(updatedFormData);
    if(errors.length>0){
        toast.error(errors[0], {
            position: 'top-center',
          });
    }else{
      console.log('Request Data:', updatedFormData);
      const newTaskResponse = await addNewTask(updatedFormData);
      if(newTaskResponse.data.success){
        console.log(newTaskResponse.data)
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
  const fetchStockItems = async()=>{
    try {
      const stockItemsResponse = await getStockItems();
      if(stockItemsResponse.data.success){
        setStockItems(stockItemsResponse.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
useEffect(()=>{
  getAllSupervisors();
  getAllWorkers();
  getAllTeams();
  getAllPlaces();
  fetchStockItems();
},[])
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to={'/dashboard/tasks'}
          onClick={onBack}
          className="hover:text-green-600 transition-colors font-medium cursor-pointer"
        >
          Tasks
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Create New Task</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
              <p className="text-gray-600 mt-1">Fill in the details to submit a new task</p>
            </div>
          </div>
          <div className="hidden md:block lg:flex items-center space-x-3">
            <button
              onClick={handleSubmit}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Task
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
                      value={formData.title}
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
                  onClick={handleSubmit}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Create Task
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
                      setEditingItem(null);
                      setTaskItem({
                        itemId: '',
                        quantity: '',
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
                      {editingItem !== null ? 'Edit Task' : 'Add New Item'}
                    </h4>
                    <button
                      onClick={() => {
                        setShowItemForm(false);
                        setEditingItem(null);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Item</label>
                      <select
                        value={taskItem.itemId}
                        onChange={(e) => handleTaskInputChange('itemId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select Item</option>
                        {stockItems.map(item => (
                          <option key={item.itemId} value={item.itemId}>{`${item.name} - ${item.unit?.toUpperCase()}`}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                       <input
                        type="number"
                        value={taskItem.quantity}
                        min={0}
                        max={10000}
                        onChange={(e) => handleTaskInputChange('quantity', e.target.value)}
                        placeholder="Enter Quantity"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => {
                        setShowItemForm(false);
                        setEditingItem(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addItem}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {editingItem !== null ? 'Update Item' : 'Add Item'}
                    </button>
                  </div>
                </div>
              )}

              {/* Items List */}
              {items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900"> {stockItems.find(obj => obj.itemId === item.itemId)?.name || 'Unknown'}</h4>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{item.quantity} {stockItems.find(obj => obj.itemId === item.itemId)?.unit.toUpperCase() || ''}</h4>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => editItem(index)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Task"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this task?')) {
                                deleteItem(index);
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
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Items added yet</h4>
                  <p className="text-gray-600 mb-4">Add Task Items</p>
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

export default CreateRequest;   