import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
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
  Timer,
  Users,
  Flag,
  Activity,
  Zap,
  Target,
  PlayCircle,
  PauseCircle,
  RotateCcw
} from "lucide-react";

const Tasks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedAssignee, setSelectedAssignee] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'kanban', 'calendar'

  const tasksPerPage = 10;

  // Mock data - replace with your API calls
  const [tasksData, setTasksData] = useState([
    {
      id: 'TSK-001',
      title: 'Clean Place H22',
      description: 'Clean and Completed the H22 section.',
      category: 'Cleaning',
      priority: 'High',
      status: 'In Progress',
      assignee: {
        name: 'Palitha Siriwardhana',
        role: 'Supervisor',
        avatar: 'SJ',
        id: 'user1'
      },
      reporter: {
        name: 'Nimal Perera',
        role: 'Manager',
        avatar: 'MC'
      },
      dateCreated: '2024-01-15',
      dueDate: '2024-01-25',
      startDate: '2024-01-16',
      estimatedHours: 40,
      actualHours: 28,
      completionPercentage: 70,
      department: 'Cleaning',
      attachments: 3,
      comments: 7,
      tags: ['cleaning', '', ''],
      subtasks: [
        { id: 'sub1', title: 'Collect Equiepments', completed: true },
      ]
    },
    {
      id: 'TSK-002',
      title: 'Tea Plucking on Section H25',
      description: 'Complete Tea plucking at section H25',
      category: 'Tea Plucking',
      priority: 'Critical',
      status: 'Todo',
      assignee: {
        name: 'Ishara Sandun',
        role: 'Supervisor',
        avatar: 'AR',
        id: 'user2'
      },
      reporter: {
        name: 'Nimal Perera',
        role: 'Manager',
        avatar: 'LK'
      },
      dateCreated: '2024-01-12',
      dueDate: '2024-01-20',
      startDate: '2024-01-18',
      estimatedHours: 32,
      actualHours: 0,
      completionPercentage: 0,
      department: 'Production',
      attachments: 2,
      comments: 4,
      tags: ['tea-plucking', 'performance', ''],
      subtasks: [
        { id: 'sub5', title: 'complete the target of 5000Kg', completed: false },
      ]
    },
    // {
    //   id: 'TSK-003',
    //   title: 'Mobile App UI/UX Redesign',
    //   description: 'Complete redesign of the mobile application interface based on user feedback and modern design principles',
    //   category: 'Design',
    //   priority: 'Medium',
    //   status: 'Completed',
    //   assignee: {
    //     name: 'Emma Wilson',
    //     role: 'UI/UX Designer',
    //     avatar: 'EW',
    //     id: 'user3'
    //   },
    //   reporter: {
    //     name: 'David Park',
    //     role: 'Product Manager',
    //     avatar: 'DP'
    //   },
    //   dateCreated: '2024-01-05',
    //   dueDate: '2024-01-15',
    //   startDate: '2024-01-06',
    //   estimatedHours: 60,
    //   actualHours: 58,
    //   completionPercentage: 100,
    //   department: 'Design',
    //   attachments: 8,
    //   comments: 12,
    //   tags: ['ui', 'ux', 'mobile', 'redesign'],
    //   subtasks: [
    //     { id: 'sub8', title: 'User research analysis', completed: true },
    //     { id: 'sub9', title: 'Wireframe creation', completed: true },
    //     { id: 'sub10', title: 'High-fidelity mockups', completed: true },
    //     { id: 'sub11', title: 'Prototype testing', completed: true }
    //   ]
    // },
    // {
    //   id: 'TSK-004',
    //   title: 'API Documentation Update',
    //   description: 'Update comprehensive API documentation for v2.0 release including new endpoints and authentication methods',
    //   category: 'Documentation',
    //   priority: 'Low',
    //   status: 'In Review',
    //   assignee: {
    //     name: 'James Taylor',
    //     role: 'Technical Writer',
    //     avatar: 'JT',
    //     id: 'user4'
    //   },
    //   reporter: {
    //     name: 'Sarah Johnson',
    //     role: 'Senior Developer',
    //     avatar: 'SJ'
    //   },
    //   dateCreated: '2024-01-08',
    //   dueDate: '2024-01-22',
    //   startDate: '2024-01-10',
    //   estimatedHours: 24,
    //   actualHours: 16,
    //   completionPercentage: 85,
    //   department: 'Engineering',
    //   attachments: 1,
    //   comments: 3,
    //   tags: ['documentation', 'api', 'v2.0'],
    //   subtasks: [
    //     { id: 'sub12', title: 'Document new endpoints', completed: true },
    //     { id: 'sub13', title: 'Update authentication guide', completed: true },
    //     { id: 'sub14', title: 'Create code examples', completed: false }
    //   ]
    // },
    // {
    //   id: 'TSK-005',
    //   title: 'Security Vulnerability Assessment',
    //   description: 'Comprehensive security audit and vulnerability assessment of the entire application stack',
    //   category: 'Security',
    //   priority: 'Critical',
    //   status: 'Blocked',
    //   assignee: {
    //     name: 'Robert Kim',
    //     role: 'Security Engineer',
    //     avatar: 'RK',
    //     id: 'user5'
    //   },
    //   reporter: {
    //     name: 'Mike Chen',
    //     role: 'Project Manager',
    //     avatar: 'MC'
    //   },
    //   dateCreated: '2024-01-10',
    //   dueDate: '2024-01-28',
    //   startDate: '2024-01-12',
    //   estimatedHours: 48,
    //   actualHours: 8,
    //   completionPercentage: 15,
    //   department: 'Security',
    //   attachments: 0,
    //   comments: 6,
    //   tags: ['security', 'audit', 'vulnerability'],
    //   subtasks: [
    //     { id: 'sub15', title: 'Infrastructure scan', completed: true },
    //     { id: 'sub16', title: 'Application penetration test', completed: false },
    //     { id: 'sub17', title: 'Code security review', completed: false }
    //   ]
    // }
  ]);

  const categories = ['all', 'Development', 'Design', 'Database', 'Documentation', 'Security', 'Testing', 'DevOps'];
  const statuses = ['all', 'Todo', 'In Progress', 'In Review', 'Blocked', 'Completed', 'Cancelled'];
  const priorities = ['all', 'Low', 'Medium', 'High', 'Critical'];
  const assignees = ['all', ...Array.from(new Set(tasksData.map(task => task.assignee.name)))];

  // Calculate stats
  const totalTasks = tasksData.length;
  const todoTasks = tasksData.filter(task => task.status === 'Todo').length;
  const inProgressTasks = tasksData.filter(task => task.status === 'In Progress').length;
  const completedTasks = tasksData.filter(task => task.status === 'Completed').length;
  const blockedTasks = tasksData.filter(task => task.status === 'Blocked').length;
  const overdueTasks = tasksData.filter(task => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'Completed';
  }).length;

  // Filter and search logic
  const filteredTasks = tasksData.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesAssignee = selectedAssignee === 'all' || task.assignee.name === selectedAssignee;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesAssignee;
  });

  // Sorting logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    if (sortConfig.key === 'assignee') {
      aValue = a.assignee.name;
      bValue = b.assignee.name;
    }
    
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
        : currentTasks.map(task => task.id)
    );
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Todo': 'bg-gray-100 text-gray-800 border-gray-200',
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'In Review': 'bg-purple-100 text-purple-800 border-purple-200',
      'Blocked': 'bg-red-100 text-red-800 border-red-200',
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'Cancelled': 'bg-gray-100 text-gray-600 border-gray-200'
    };
    
    const statusIcons = {
      'Todo': <Clock className="h-3 w-3 mr-1" />,
      'In Progress': <PlayCircle className="h-3 w-3 mr-1" />,
      'In Review': <Eye className="h-3 w-3 mr-1" />,
      'Blocked': <XCircle className="h-3 w-3 mr-1" />,
      'Completed': <CheckCircle className="h-3 w-3 mr-1" />,
      'Cancelled': <X className="h-3 w-3 mr-1" />
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusIcons[status]}
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
    
    const priorityIcons = {
      'Low': <Flag className="h-3 w-3 mr-1" />,
      'Medium': <Flag className="h-3 w-3 mr-1" />,
      'High': <Flag className="h-3 w-3 mr-1" />,
      'Critical': <AlertTriangle className="h-3 w-3 mr-1" />
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityStyles[priority] || 'bg-gray-100 text-gray-800'}`}>
        {priorityIcons[priority]}
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

  const getProgressColor = (percentage) => {
    if (percentage === 0) return 'bg-gray-200';
    if (percentage < 30) return 'bg-red-200';
    if (percentage < 70) return 'bg-yellow-200';
    return 'bg-green-200';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage === 0) return 'bg-gray-400';
    if (percentage < 30) return 'bg-red-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const TaskModal = ({ task, onClose }) => {
    if (!task) return null;
    
    const completedSubtasks = task.subtasks.filter(sub => sub.completed).length;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{task.title}</h3>
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                </div>
                <p className="text-gray-600">Task ID: {task.id}</p>
                <div className="flex items-center space-x-1 mt-2">
                  {task.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{task.description}</p>
                </div>

                {/* Progress Section */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Progress & Time Tracking</h4>
                  <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                      <span className="text-sm font-semibold text-gray-900">{task.completionPercentage}%</span>
                    </div>
                    <div className={`w-full ${getProgressColor(task.completionPercentage)} rounded-full h-3`}>
                      <div 
                        className={`h-3 ${getProgressBarColor(task.completionPercentage)} rounded-full transition-all duration-300`}
                        style={{ width: `${task.completionPercentage}%` }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">Estimated Hours</p>
                        <p className="font-semibold text-gray-900">{task.estimatedHours}h</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Actual Hours</p>
                        <p className="font-semibold text-gray-900">{task.actualHours}h</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtasks */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Subtasks ({completedSubtasks}/{task.subtasks.length})
                  </h4>
                  <div className="space-y-2">
                    {task.subtasks.map(subtask => (
                      <div key={subtask.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          readOnly
                        />
                        <span className={`flex-1 text-sm ${subtask.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Activity & Comments</h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {task.assignee.avatar}
                        </div>
                        <div>
                          <span className="font-medium text-sm">{task.assignee.name}</span>
                          <span className="text-xs text-gray-500 ml-2">4 hours ago</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">Updated task progress to 70%. Authentication middleware is complete and working as expected.</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {task.reporter.avatar}
                        </div>
                        <div>
                          <span className="font-medium text-sm">{task.reporter.name}</span>
                          <span className="text-xs text-gray-500 ml-2">1 day ago</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">Task assigned and started. Please prioritize the MFA implementation as it's critical for the upcoming release.</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a comment or update..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Task Details</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <div className="mt-1">{getStatusBadge(task.status)}</div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600">Priority</label>
                        <div className="mt-1">{getPriorityBadge(task.priority)}</div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Category</label>
                      <p className="text-sm text-gray-900 mt-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded inline-block">
                        {task.category}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Department</label>
                      <p className="text-sm text-gray-900 mt-1">{task.department}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Start Date</label>
                        <p className="text-sm text-gray-900 mt-1">{formatDate(task.startDate)}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600">Due Date</label>
                        <p className="text-sm text-gray-900 mt-1">{formatDate(task.dueDate)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Created</label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(task.dateCreated)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Team</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {task.assignee.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.assignee.name}</p>
                        <p className="text-xs text-gray-600">Assignee • {task.assignee.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {task.reporter.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.reporter.name}</p>
                        <p className="text-xs text-gray-600">Reporter • {task.reporter.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {task.attachments > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Attachments ({task.attachments})</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700 flex-1">authentication_spec.pdf</span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700 flex-1">wireframes.sketch</span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start Task
                    </button>
                    <button className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Task
                    </button>
                    <button className="w-full flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      Reassign
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Enhanced Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{totalTasks}</p>
              <p className="text-sm text-blue-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last week
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <CheckSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Todo</p>
              <p className="text-3xl font-bold text-gray-600">{todoTasks}</p>
              <p className="text-sm text-gray-500 mt-1">Ready to start</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{inProgressTasks}</p>
              <p className="text-sm text-blue-600 mt-1">Active work</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
              <p className="text-sm text-green-600 mt-1">Successfully done</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Blocked</p>
              <p className="text-3xl font-bold text-red-600">{blockedTasks}</p>
              <p className="text-sm text-red-600 mt-1">Need attention</p>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Overdue</p>
              <p className="text-3xl font-bold text-orange-600">{overdueTasks}</p>
              <p className="text-sm text-orange-600 mt-1">Past due date</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
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
              <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
              <p className="text-gray-600 mt-1">Organize, track, and manage all your team tasks efficiently</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <CheckSquare className="h-4 w-4 mr-1" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Target className="h-4 w-4 mr-1" />
                  Board
                </button>
              </div>

              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </button>
              
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
                placeholder="Search tasks, ID, assignee, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {selectedTasks.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border">
                    {selectedTasks.length} selected
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Bulk Actions
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Filter Dropdowns */}
          {showFilters && (
            <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority === 'all' ? 'All Priorities' : priority}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                  <select
                    value={selectedAssignee}
                    onChange={(e) => setSelectedAssignee(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {assignees.map(assignee => (
                      <option key={assignee} value={assignee}>
                        {assignee === 'all' ? 'All Assignees' : assignee}
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
                      setSelectedAssignee('all');
                      setSearchQuery('');
                    }}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedTasks.length === currentTasks.length && currentTasks.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th 
                  className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Task ID</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-gray-700 min-w-[300px]">Task Details</th>
                <th 
                  className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('assignee')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Assignee</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                <th className="text-left p-4 font-semibold text-gray-700">Priority</th>
                <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700">Progress</th>
                <th className="text-left p-4 font-semibold text-gray-700">Due Date</th>
                <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task) => (
                <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => handleSelectTask(task.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  
                  <td className="p-4">
                    <span className="font-mono text-sm bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
                      {task.id}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div>
                      <div className="font-semibold text-gray-900 mb-2 leading-tight">{task.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {task.description}
                      </div>
                      <div className="flex items-center flex-wrap gap-2">
                        {task.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                            #{tag}
                          </span>
                        ))}
                        {task.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{task.tags.length - 3} more</span>
                        )}
                      </div>
                      <div className="flex items-center mt-3 space-x-4 text-xs text-gray-500">
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
                        <div className="flex items-center">
                          <Timer className="h-3 w-3 mr-1" />
                          {task.actualHours}/{task.estimatedHours}h
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-9 h-9 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {task.assignee.avatar}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{task.assignee.name}</div>
                        <div className="text-sm text-gray-600">{task.assignee.role}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-200">
                      {task.category}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    {getPriorityBadge(task.priority)}
                  </td>
                  
                  <td className="p-4">
                    {getStatusBadge(task.status)}
                  </td>

                  <td className="p-4">
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-900">{task.completionPercentage}%</span>
                        <span className="text-xs text-gray-600">
                          {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                        </span>
                      </div>
                      <div className={`w-full ${getProgressColor(task.completionPercentage)} rounded-full h-2`}>
                        <div 
                          className={`h-2 ${getProgressBarColor(task.completionPercentage)} rounded-full transition-all duration-300`}
                          style={{ width: `${task.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(task.dueDate)}
                      </div>
                      <div className={`text-xs font-medium ${
                        getDaysUntilDue(task.dueDate) < 0 
                          ? 'text-red-600' 
                          : getDaysUntilDue(task.dueDate) < 3 
                            ? 'text-orange-600' 
                            : 'text-gray-600'
                      }`}>
                        {(() => {
                          const days = getDaysUntilDue(task.dueDate);
                          if (days < 0) return `${Math.abs(days)}d overdue`;
                          if (days === 0) return 'Due today';
                          return `${days}d left`;
                        })()}
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setSelectedTask(task);
                          setShowTaskModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Task"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {task.status !== 'In Progress' && (
                        <button 
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Start Task"
                        >
                          <PlayCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="More Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, sortedTasks.length)}</span> of{' '}
              <span className="font-medium">{sortedTasks.length}</span> tasks
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
                          ? "bg-blue-600 text-white shadow-sm"
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
  );
};

export default Tasks;