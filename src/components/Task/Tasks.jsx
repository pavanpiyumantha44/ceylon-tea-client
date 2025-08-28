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
  X
} from "lucide-react";
import { Link } from 'react-router-dom';
import Report from '../Reports/Report';

const Requests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const requestsPerPage = 8;

  // Mock data - replace with your API calls
  const [requestsData, setRequestsData] = useState([
    {
      id: 'REQ-001',
      title: 'Equipment Maintenance Request',
      description: 'Tea processing machine requires urgent maintenance',
      category: 'Maintenance',
      priority: 'High',
      status: 'Pending',
      requester: {
        name: 'John Silva',
        role: 'Production Manager',
        avatar: 'JS'
      },
      assignedTo: {
        name: 'Mike Fernando',
        role: 'Maintenance Lead'
      },
      dateCreated: '2024-01-15',
      dueDate: '2024-01-20',
      department: 'Production',
      attachments: 2,
      comments: 3
    },
    {
      id: 'REQ-002',
      title: 'Leave Application',
      description: 'Medical leave request for 5 days',
      category: 'HR',
      priority: 'Medium',
      status: 'Approved',
      requester: {
        name: 'Sarah Perera',
        role: 'Quality Controller',
        avatar: 'SP'
      },
      assignedTo: {
        name: 'Lisa Kumar',
        role: 'HR Manager'
      },
      dateCreated: '2024-01-12',
      dueDate: '2024-01-18',
      department: 'Quality Control',
      attachments: 1,
      comments: 2
    },
    {
      id: 'REQ-003',
      title: 'Supply Purchase Request',
      description: 'Request for new packaging materials',
      category: 'Procurement',
      priority: 'Low',
      status: 'In Progress',
      requester: {
        name: 'David Wong',
        role: 'Packaging Supervisor',
        avatar: 'DW'
      },
      assignedTo: {
        name: 'Anna Rodriguez',
        role: 'Procurement Officer'
      },
      dateCreated: '2024-01-10',
      dueDate: '2024-01-25',
      department: 'Packaging',
      attachments: 0,
      comments: 5
    },
    {
      id: 'REQ-004',
      title: 'Safety Training Request',
      description: 'Mandatory safety training for new employees',
      category: 'Training',
      priority: 'Medium',
      status: 'Rejected',
      requester: {
        name: 'Emily Chen',
        role: 'Safety Officer',
        avatar: 'EC'
      },
      assignedTo: {
        name: 'Robert Taylor',
        role: 'Training Coordinator'
      },
      dateCreated: '2024-01-08',
      dueDate: '2024-01-22',
      department: 'Safety',
      attachments: 3,
      comments: 1
    }
  ]);

  const categories = ['all', 'Maintenance', 'HR', 'Procurement', 'Training', 'IT Support', 'Finance'];
  const statuses = ['all', 'Pending', 'In Progress', 'Approved', 'Rejected', 'Completed'];
  const priorities = ['all', 'Low', 'Medium', 'High', 'Critical'];

  // Calculate stats
  const totalRequests = requestsData.length;
  const pendingRequests = requestsData.filter(req => req.status === 'Pending').length;
  const inProgressRequests = requestsData.filter(req => req.status === 'In Progress').length;
  const completedRequests = requestsData.filter(req => req.status === 'Completed' || req.status === 'Approved').length;

  // Filter and search logic
  const filteredRequests = requestsData.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || request.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  // Sorting logic
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedRequests.length / requestsPerPage);
  const startIndex = (currentPage - 1) * requestsPerPage;
  const endIndex = startIndex + requestsPerPage;
  const currentRequests = sortedRequests.slice(startIndex, endIndex);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectRequest = (requestId) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRequests(
      selectedRequests.length === currentRequests.length 
        ? [] 
        : currentRequests.map(request => request.id)
    );
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityStyles = {
      'Low': 'bg-gray-100 text-gray-800 border-gray-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'High': 'bg-orange-100 text-orange-800 border-orange-200',
      'Critical': 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityStyles[priority] || 'bg-gray-100 text-gray-800'}`}>
        {priority}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const RequestModal = ({ request, onClose }) => {
    if (!request) return null;
    
    return (
      <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{request.title}</h3>
                <p className="text-gray-600 mt-1">Request ID: {request.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{request.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Comments & Updates</h4>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {request.assignedTo.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-sm">{request.assignedTo.name}</span>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-700">Request has been reviewed and approved for processing.</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Request Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <div className="mt-1">{getStatusBadge(request.status)}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Priority</label>
                      <div className="mt-1">{getPriorityBadge(request.priority)}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Category</label>
                      <p className="text-sm text-gray-900 mt-1">{request.category}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Department</label>
                      <p className="text-sm text-gray-900 mt-1">{request.department}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Created</label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(request.dateCreated)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Due Date</label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(request.dueDate)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">People</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {request.requester.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{request.requester.name}</p>
                        <p className="text-xs text-gray-600">Requester • {request.requester.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {request.assignedTo.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{request.assignedTo.name}</p>
                        <p className="text-xs text-gray-600">Assigned • {request.assignedTo.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {request.attachments > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Attachments ({request.attachments})</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">maintenance_report.pdf</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Update Status
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900">{totalRequests}</p>
              <p className="text-sm text-green-600 mt-1">+8% from last month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingRequests}</p>
              <p className="text-sm text-yellow-600 mt-1">Awaiting review</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{inProgressRequests}</p>
              <p className="text-sm text-blue-600 mt-1">Being processed</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedRequests}</p>
              <p className="text-sm text-green-600 mt-1">Successfully resolved</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Request Management</h2>
              <p className="text-gray-600 mt-1">Track and manage all system requests efficiently</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to={'/dashboard/newTask'} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Link>
              <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests, ID, or requester..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {selectedRequests.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedRequests.length} selected</span>
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                    Bulk Update
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filter Dropdowns */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'all' ? 'All Statuses' : status}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority === 'all' ? 'All Priorities' : priority}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedStatus('all');
                      setSelectedPriority('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedRequests.length === currentRequests.length && currentRequests.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </th>
                <th 
                  className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('id')}
                >
                  Request ID
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">Request Details</th>
                <th className="text-left p-4 font-semibold text-gray-700">Requester</th>
                <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                <th className="text-left p-4 font-semibold text-gray-700">Priority</th>
                <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700">Due Date</th>
                <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedRequests.includes(request.id)}
                      onChange={() => handleSelectRequest(request.id)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </td>
                  
                  <td className="p-4">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {request.id}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">{request.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {request.description}
                      </div>
                      <div className="flex items-center mt-2 space-x-3 text-xs text-gray-500">
                        {request.attachments > 0 && (
                          <div className="flex items-center">
                            <Paperclip className="h-3 w-3 mr-1" />
                            {request.attachments}
                          </div>
                        )}
                        {request.comments > 0 && (
                          <div className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {request.comments}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {request.requester.avatar}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{request.requester.name}</div>
                        <div className="text-sm text-gray-600">{request.requester.role}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                      {request.category}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    {getPriorityBadge(request.priority)}
                  </td>
                  
                  <td className="p-4">
                    {getStatusBadge(request.status)}
                  </td>
                  
                  <td className="p-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(request.dueDate)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {(() => {
                          const days = getDaysUntilDue(request.dueDate);
                          if (days < 0) return `${Math.abs(days)} days overdue`;
                          if (days === 0) return 'Due today';
                          return `${days} days left`;
                        })()}
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRequestModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedRequests.length)} of {sortedRequests.length} requests
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 hover:bg-gray-200 bg-white border border-gray-300"
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              
              <div className="flex space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
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
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 hover:bg-gray-200 bg-white border border-gray-300"
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <RequestModal 
          request={selectedRequest} 
          onClose={() => {
            setShowRequestModal(false);
            setSelectedRequest(null);
          }} 
        />
      )}
    </div>
  );
};

export default Requests