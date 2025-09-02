import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  User,
  Calendar,
  Tag,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  Paperclip,
  Send,
  X,
  Menu
} from "lucide-react";
import { Link } from 'react-router-dom';
import { allTasks, updateTaskStatus } from '../../services/taskService';
import { ToastContainer, toast } from 'react-toastify';

const Tasks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [reload,setReload] = useState(false);

  const tasksPerPage = 8;


  const [tasksData, setTasksData] = useState([]);

  const taskTypes = ['all', 'Maintenance', 'Quality Control', 'Inventory', 'Training', 'IT Support', 'Administrative'];
  const statuses = ['ASSIGNED','PENDING', 'IN_PROCESS', 'COMPLETED', 'CANCELLED'];

  // Calculate stats
  const totalTasks = tasksData.length;
  const pendingTasks = tasksData.filter(task => task.taskStatus === 'PENDING').length;
  const inProgressTasks = tasksData.filter(task => task.taskStatus === 'IN_PROCESS').length;
  const completedTasks = tasksData.filter(task => task.taskStatus === 'COMPLETED').length;

  // Filter and search logic
  const filteredTasks = tasksData.filter(task => {
    const matchesSearch = task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.taskId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.taskType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTaskType = selectedTaskType === 'all' || task.taskType === selectedTaskType;
    const matchesStatus = selectedStatus === 'all' || task.taskStatus === selectedStatus;
    
    return matchesSearch && matchesTaskType && matchesStatus;
  });

  // Sorting logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTasks = sortedTasks.slice(startIndex, endIndex);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTasks(
      selectedTasks.length === currentTasks.length 
        ? [] 
        : currentTasks.map(task => task.taskId)
    );
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'ASSIGNED': 'bg-yellow-100 text-gray-800 border-gray-200',
      'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'IN_PROCESS': 'bg-blue-100 text-blue-800 border-blue-200',
      'COMPLETED': 'bg-green-100 text-green-800 border-green-200',
      'CANCELLED': 'bg-red-100 text-red-800 border-red-200'
    };
    
    const statusLabels = {
      'PENDING': 'Pending',
      'IN_PROCESS': 'In Progress',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleUpdateStatus=async()=>{
    const updateResponse = await updateTaskStatus(selectedTask.taskId,selectedTask.taskStatus);
    if(updateResponse.data.success){
      setReload(!reload);
      setShowTaskModal(false);
      toast.success("Status updated successfully!", {
            position: 'top-center',
          });
    }else{
      toast.error("Failed to update the status", {
            position: 'top-center',
          });
    }
  }
  const fetchTasks = async () => {
  const tasksResponse = await allTasks();
  if (tasksResponse.data.success) {
    const rawTasks = tasksResponse.data.data;
    // console.log(tasksResponse.data.data);

    const formattedTasks = rawTasks.map((task) => {
      const creator = task.creator || {};
      const supervisor = task.supervisor || {};

      const formatName = (first, last) => `${first || ''} ${last || ''}`.trim();
      const getInitials = (first, last) =>
        `${(first?.[0] || '').toUpperCase()}${(last?.[0] || '').toUpperCase()}`;

      return {
        taskId: task.taskId,
        taskCode: task.taskCode,
        taskName: task.taskName,
        description: task.description,
        taskType: task.taskType,
        taskStatus: task.taskStatus,
        startDateTime: task.startDateTime,
        endDateTime: task.endDateTime,
        createdBy: creator.email || '',
        assignedSupervisor: supervisor.email || '',
        teamId: task.assignedTeam.name,
        workerId: task.workerId,
        placeId: task.taskPlace.placeCode,
        isDeleted: task.isDeleted,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,

        creator: {
          name: formatName(creator.firstName, creator.lastName),
          role: task.creator.roleId,
          avatar: getInitials(creator.firstName, creator.lastName),
        },
        supervisor: {
          name: formatName(supervisor.firstName, supervisor.lastName),
          role: 'Supervisor',
          avatar: getInitials(supervisor.firstName, supervisor.lastName),
        },
      };
    });

    setTasksData(formattedTasks);
  }
};

  useEffect(()=>{
    fetchTasks();
  },[reload])

  const TaskModal = ({ task, onClose }) => {
    if (!task) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">{task.taskName}</h3>
                <p className="text-gray-600 mt-1 text-sm">Task ID: TSK-{task.taskCode}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700 text-sm sm:text-base">{task.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Start Date & Time</label>
                        <p className="text-sm text-gray-900 mt-1">{formatDateTime(task.startDateTime)}</p>
                      </div>
                      {task.endDateTime && (
                        <div>
                          <label className="text-xs font-medium text-gray-600">End Date & Time</label>
                          <p className="text-sm text-gray-900 mt-1">{formatDateTime(task.endDateTime)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>              
                  <div className="mt-4 flex space-x-2">
                    <select
                      value={selectedTask.taskStatus}
                      onChange={(e) => setSelectedTask({ ...selectedTask, taskStatus: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <button className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Task Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <div className="mt-1">{getStatusBadge(task.taskStatus)}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Task Type</label>
                      <p className="text-sm text-gray-900 mt-1">{task.taskType}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Team ID</label>
                      <p className="text-sm text-gray-900 mt-1">{task.teamId || 'Not assigned'}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Place ID</label>
                      <p className="text-sm text-gray-900 mt-1">{task.placeId}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Created</label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(task.createdAt)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Last Updated</label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(task.updatedAt)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">People</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {task.creator.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.creator.name}</p>
                        <p className="text-xs text-gray-600">Creator • {task.creator.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {task.supervisor.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.supervisor.name}</p>
                        <p className="text-xs text-gray-600">Supervisor • {task.supervisor.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
            onClick={handleUpdateStatus}>
              Update Status
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Mobile Card Component
  const TaskCard = ({ task }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Link to={`/dashboard/editTask/${task.taskId}`} className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              TSK-{task.taskCode}
            </Link>
            {getStatusBadge(task.taskStatus)}
          </div>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{task.taskName}</h3>
          <p className="text-gray-600 text-xs mt-1 line-clamp-2">{task.description}</p>
        </div>
        <button
          onClick={() => {
            setSelectedTask(task);
            setShowTaskModal(true);
          }}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-2"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {task.creator.avatar}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900">{task.creator.name}</p>
            <p className="text-xs text-gray-500">{task.taskType}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-gray-500">Created</p>
          <p className="text-xs font-medium text-gray-900">{formatDate(task.createdAt)}</p>
        </div>
      </div>
      
      {(task.attachments > 0 || task.comments > 0) && (
        <div className="flex items-center mt-3 pt-3 border-t border-gray-100 space-x-4 text-xs text-gray-500">
          {task.attachments > 0 && (
            <div className="flex items-center">
              <Paperclip className="h-3 w-3 mr-1" />
              {task.attachments}
            </div>
          )}
          {task.comments > 0 && (
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              {task.comments}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer autoClose={2000} />
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Tasks</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
                <p className="text-xl lg:text-3xl font-bold text-gray-900">{totalTasks}</p>
                <p className="text-xs lg:text-sm text-green-600 mt-1">+8% from last month</p>
              </div>
              <div className="bg-blue-100 p-2 lg:p-3 rounded-lg lg:rounded-xl">
                <FileText className="h-4 w-4 lg:h-6 lg:w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-xl lg:text-3xl font-bold text-yellow-600">{pendingTasks}</p>
                <p className="text-xs lg:text-sm text-yellow-600 mt-1">Awaiting start</p>
              </div>
              <div className="bg-yellow-100 p-2 lg:p-3 rounded-lg lg:rounded-xl">
                <Clock className="h-4 w-4 lg:h-6 lg:w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">In Progress</p>
                <p className="text-xl lg:text-3xl font-bold text-blue-600">{inProgressTasks}</p>
                <p className="text-xs lg:text-sm text-blue-600 mt-1">Being worked on</p>
              </div>
              <div className="bg-blue-100 p-2 lg:p-3 rounded-lg lg:rounded-xl">
                <AlertTriangle className="h-4 w-4 lg:h-6 lg:w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-xl lg:text-3xl font-bold text-green-600">{completedTasks}</p>
                <p className="text-xs lg:text-sm text-green-600 mt-1">Successfully done</p>
              </div>
              <div className="bg-green-100 p-2 lg:p-3 rounded-lg lg:rounded-xl">
                <CheckCircle className="h-4 w-4 lg:h-6 lg:w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100">
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Tasks Management</h2>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">Track and manage all system tasks efficiently</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <Link to='/dashboard/newTask' className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Link>
                <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-4 lg:p-6 border-b border-gray-200 bg-gray-50">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks, ID, or creator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm lg:text-base"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  

                </div>
                
                {selectedTasks.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{selectedTasks.length} selected</span>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                      Bulk Update
                    </button>
                  </div>
                )}
              </div>

              {/* Filter Dropdowns */}
              {showFilters && (
                <div className="p-4 bg-white rounded-xl border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
                      <select
                        value={selectedTaskType}
                        onChange={(e) => setSelectedTaskType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      >
                        {taskTypes.map(type => (
                          <option key={type} value={type}>
                            {type === 'all' ? 'All Types' : type}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>
                            {status === 'all' ? 'All Statuses' : status.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="sm:col-span-2 lg:col-span-2 flex items-end">
                      <button
                        onClick={() => {
                          setSelectedTaskType('all');
                          setSelectedStatus('all');
                          setSearchQuery('');
                        }}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 lg:p-0">
            {/* Mobile Card View */}
            <div className="lg:hidden">
              <div className="space-y-3">
                {currentTasks.map((task) => (
                  <TaskCard key={task.taskId} task={task} />
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              {/* Desktop Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left p-4">
                        <input
                          type="checkbox"
                          checked={selectedTasks.length === currentTasks.length && currentTasks.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </th>
                      <th 
                        className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('taskId')}
                      >
                        Task ID
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">Task Details</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Creator</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Created Date</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTasks.map((task) => (
                      <tr key={task.taskId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedTasks.includes(task.taskId)}
                            onChange={() => handleSelectTask(task.taskId)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                        </td>
                        
                        <td className="p-4">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            TSK-{task.taskCode}
                          </span>
                        </td>
                        
                        <td className="p-4">
                          <div>
                            <div className="font-semibold text-gray-900 mb-1">{task.taskName}</div>
                            <div className="text-sm text-gray-600 line-clamp-2 max-w-md">
                              {task.description}
                            </div>
                            <div className="flex items-center mt-2 space-x-3 text-xs text-gray-500">
                              {task.attachments > 0 && (
                                <div className="flex items-center">
                                  <Paperclip className="h-3 w-3 mr-1" />
                                  {task.attachments}
                                </div>
                              )}
                              {task.comments > 0 && (
                                <div className="flex items-center">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  {task.comments}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                {task.creator.avatar}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{task.creator.name}</div>
                              <div className="text-xs text-gray-600">{task.creator.role}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                            {task.taskType}
                          </span>
                        </td>
                        
                        <td className="p-4">
                          {getStatusBadge(task.taskStatus)}
                        </td>
                        
                        <td className="p-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(task.createdAt)}
                            </div>
                            <div className="text-xs text-gray-600">
                              {formatDate(task.startDateTime)}
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedTask(task);
                                setShowTaskModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <Link to={`/dashboard/editTask/${task.taskId}`} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


            </div>

            {/* Pagination */}
            <div className="px-4 lg:px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, sortedTasks.length)} of {sortedTasks.length} tasks
                </div>
                
                <div className="flex items-center justify-center sm:justify-end space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 lg:px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:bg-gray-200 bg-white border border-gray-300"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  
                  <div className="flex space-x-1">
                    {[...Array(Math.min(3, totalPages))].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 lg:px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                            currentPage === page
                              ? "bg-green-600 text-white"
                              : "text-gray-700 hover:bg-gray-200 bg-white border border-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-3 lg:px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:bg-gray-200 bg-white border border-gray-300"
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Modal */}
        {showTaskModal && (
          <TaskModal 
            task={selectedTask} 
            onClose={() => {
              setShowTaskModal(false);
              setSelectedTask(null);
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default Tasks;