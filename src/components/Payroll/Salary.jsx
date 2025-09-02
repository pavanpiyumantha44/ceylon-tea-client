import React, { useState, useEffect } from "react";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Search, 
  RefreshCw, 
  Download, 
  Plus, 
  X, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  Calculator
} from "lucide-react";

const Payroll = () => {
  const [salaryRecords, setSalaryRecords] = useState([
    {
      salaryId: "1",
      month: "2024-08-01T00:00:00.000Z",
      basicSalary: 45000,
      otPayment: 12000,
      totalSalary: 57000,
      personId: "EMP001",
      person: { name: "Samantha Perera", position: "Tea Picker", department: "Production" },
      createdAt: "2024-08-01T10:30:00.000Z",
      updatedAt: "2024-08-01T10:30:00.000Z"
    },
    {
      salaryId: "2",
      month: "2024-08-01T00:00:00.000Z",
      basicSalary: 65000,
      otPayment: 8000,
      totalSalary: 73000,
      personId: "EMP002",
      person: { name: "Kamal Silva", position: "Factory Supervisor", department: "Production" },
      createdAt: "2024-08-01T11:15:00.000Z",
      updatedAt: "2024-08-01T11:15:00.000Z"
    },
    {
      salaryId: "3",
      month: "2024-08-01T00:00:00.000Z",
      basicSalary: 38000,
      otPayment: 15000,
      totalSalary: 53000,
      personId: "EMP003",
      person: { name: "Nimal Fernando", position: "Machine Operator", department: "Processing" },
      createdAt: "2024-08-01T09:45:00.000Z",
      updatedAt: "2024-08-01T09:45:00.000Z"
    },
    {
      salaryId: "4",
      month: "2024-08-01T00:00:00.000Z",
      basicSalary: 85000,
      otPayment: 5000,
      totalSalary: 90000,
      personId: "EMP004",
      person: { name: "Priya Rajapaksa", position: "Quality Manager", department: "Quality Control" },
      createdAt: "2024-08-01T14:20:00.000Z",
      updatedAt: "2024-08-01T14:20:00.000Z"
    },
    {
      salaryId: "5",
      month: "2024-08-01T00:00:00.000Z",
      basicSalary: 42000,
      otPayment: 9000,
      totalSalary: 51000,
      personId: "EMP005",
      person: { name: "Ravi Wickramasinghe", position: "Maintenance Tech", department: "Maintenance" },
      createdAt: "2024-08-01T08:30:00.000Z",
      updatedAt: "2024-08-01T08:30:00.000Z"
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobile, setIsMobile] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Check for mobile screen
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Format month for display
  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    if (!date) return "Never";
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  // Filter salary records
  const filteredRecords = salaryRecords.filter(record => {
    const matchesSearch = record.person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.personId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.person.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || record.person.department === departmentFilter;
    const matchesMonth = !monthFilter || formatMonth(record.month) === monthFilter;
    return matchesSearch && matchesDepartment && matchesMonth;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, departmentFilter, monthFilter, itemsPerPage]);

  // Calculate stats
  const totalEmployees = [...new Set(salaryRecords.map(r => r.personId))].length;
  const totalPayroll = salaryRecords.reduce((sum, record) => sum + (record.totalSalary || 0), 0);
  const totalOTPayments = salaryRecords.reduce((sum, record) => sum + (record.otPayment || 0), 0);
  const departments = [...new Set(salaryRecords.map(r => r.person.department))];
  const months = [...new Set(salaryRecords.map(r => formatMonth(r.month)))];
  const avgSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;

  // Add Salary Modal Component
  const AddSalaryModal = () => {
    const [formData, setFormData] = useState({
      personId: "",
      personName: "",
      month: "",
      basicSalary: "",
      otPayment: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
      const errors = {};
      
      if (!formData.personId.trim()) {
        errors.personId = "Employee ID is required";
      }
      
      if (!formData.personName.trim()) {
        errors.personName = "Employee name is required";
      }
      
      if (!formData.month) {
        errors.month = "Month is required";
      }
      
      if (!formData.basicSalary) {
        errors.basicSalary = "Basic salary is required";
      } else if (isNaN(formData.basicSalary) || Number(formData.basicSalary) <= 0) {
        errors.basicSalary = "Basic salary must be a positive number";
      }
      
      if (formData.otPayment && (isNaN(formData.otPayment) || Number(formData.otPayment) < 0)) {
        errors.otPayment = "OT payment must be a positive number";
      }
      
      return errors;
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when user starts typing
      if (formErrors[name]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
    };

    const calculateTotal = () => {
      const basic = Number(formData.basicSalary) || 0;
      const ot = Number(formData.otPayment) || 0;
      return basic + ot;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setIsSubmitting(true);
      
      try {
        const newRecord = {
          salaryId: (salaryRecords.length + 1).toString(),
          month: new Date(formData.month + "-01").toISOString(),
          basicSalary: Number(formData.basicSalary),
          otPayment: Number(formData.otPayment) || 0,
          totalSalary: calculateTotal(),
          personId: formData.personId.trim(),
          person: { 
            name: formData.personName.trim(), 
            position: "Employee", 
            department: "General" 
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setSalaryRecords(prev => [...prev, newRecord]);
        
        // Reset form
        setFormData({
          personId: "",
          personName: "",
          month: "",
          basicSalary: "",
          otPayment: "",
        });
        setFormErrors({});
        setShowAddModal(false);
        
      } catch (error) {
        console.error("Error adding salary record:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleClose = () => {
      setShowAddModal(false);
      setFormData({
        personId: "",
        personName: "",
        month: "",
        basicSalary: "",
        otPayment: "",
      });
      setFormErrors({});
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Add Salary Record</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {/* Employee ID */}
            <div>
              <label htmlFor="personId" className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID *
              </label>
              <input
                type="text"
                id="personId"
                name="personId"
                value={formData.personId}
                onChange={handleInputChange}
                placeholder="Enter employee ID"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  formErrors.personId ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.personId && (
                <p className="text-red-500 text-xs mt-1">{formErrors.personId}</p>
              )}
            </div>

            {/* Employee Name */}
            <div>
              <label htmlFor="personName" className="block text-sm font-medium text-gray-700 mb-1">
                Employee Name *
              </label>
              <input
                type="text"
                id="personName"
                name="personName"
                value={formData.personName}
                onChange={handleInputChange}
                placeholder="Enter employee name"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  formErrors.personName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.personName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.personName}</p>
              )}
            </div>

            {/* Month */}
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                Salary Month *
              </label>
              <input
                type="month"
                id="month"
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  formErrors.month ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.month && (
                <p className="text-red-500 text-xs mt-1">{formErrors.month}</p>
              )}
            </div>

            {/* Basic Salary */}
            <div>
              <label htmlFor="basicSalary" className="block text-sm font-medium text-gray-700 mb-1">
                Basic Salary (LKR) *
              </label>
              <input
                type="number"
                id="basicSalary"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  formErrors.basicSalary ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.basicSalary && (
                <p className="text-red-500 text-xs mt-1">{formErrors.basicSalary}</p>
              )}
            </div>

            {/* OT Payment */}
            <div>
              <label htmlFor="otPayment" className="block text-sm font-medium text-gray-700 mb-1">
                Overtime Payment (LKR)
              </label>
              <input
                type="number"
                id="otPayment"
                name="otPayment"
                value={formData.otPayment}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  formErrors.otPayment ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.otPayment && (
                <p className="text-red-500 text-xs mt-1">{formErrors.otPayment}</p>
              )}
            </div>

            {/* Calculation Preview */}
            {(formData.basicSalary || formData.otPayment) && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Basic Salary:</span>
                    <span className="font-medium">{Number(formData.basicSalary || 0).toLocaleString()} LKR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>OT Payment:</span>
                    <span className="font-medium">{Number(formData.otPayment || 0).toLocaleString()} LKR</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 mt-2">
                    <span className="font-semibold">Total Salary:</span>
                    <span className="font-bold text-green-600">
                      {calculateTotal().toLocaleString()} LKR
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Adding...
                  </>
                ) : (
                  "Add Salary Record"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Mobile Card Component
  const MobileCard = ({ record }) => {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">{record.person.name}</h4>
            <p className="text-xs text-gray-500 mt-1">ID: {record.personId}</p>
            <p className="text-xs text-gray-500">{record.person.position}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-green-600">{record.totalSalary?.toLocaleString()} LKR</p>
            <p className="text-xs text-gray-500">{formatMonth(record.month)}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-500">Basic Salary</p>
            <p className="text-sm font-medium text-gray-900">{record.basicSalary?.toLocaleString()} LKR</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">OT Payment</p>
            <p className="text-sm font-medium text-gray-900">{record.otPayment?.toLocaleString()} LKR</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Department</p>
            <p className="text-sm font-medium text-gray-900">{record.person.department}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Updated</p>
            <p className="text-sm font-medium text-gray-900">{formatTimeAgo(record.updatedAt)}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">Created {formatTimeAgo(record.createdAt)}</p>
          <div className="flex space-x-2">
            <button className="text-green-600 hover:text-green-700 text-xs font-medium flex items-center">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </button>
            <button className="text-red-600 hover:text-red-700 text-xs font-medium flex items-center">
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Pagination component
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 bg-white border-t border-gray-200 space-y-2 sm:space-y-0">
        <div className="text-sm text-gray-600">
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length} records
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          {!isMobile && (
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          )}
          
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 text-sm border rounded ${
                currentPage === number
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center">
            <Loader2 className="animate-spin h-6 w-6 text-green-600 mr-2" />
            <span className="text-gray-600">Loading payroll data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Salary Modal */}
      <AddSalaryModal />

      {/* Payroll Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {totalEmployees.toLocaleString()}
              </p>
            </div>
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payroll</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                {totalPayroll.toLocaleString()} LKR
              </p>
            </div>
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total OT Payments</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600 mt-1">
                {totalOTPayments.toLocaleString()} LKR
              </p>
            </div>
            <Clock className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Salary</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">
                {avgSalary.toLocaleString()} LKR
              </p>
            </div>
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setLoading(true)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                {!isMobile && "Refresh"}
              </button>
              
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-1" />
                {!isMobile && "Export"}
              </button>
              
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                {!isMobile && "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      {isMobile ? (
        <div className="space-y-4">
          {currentRecords.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payroll records found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            currentRecords.map((record) => (
              <MobileCard key={record.salaryId} record={record} />
            ))
          )}
          {filteredRecords.length > 0 && <Pagination />}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Payroll Management
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calculator className="h-4 w-4" />
                <span>Total Records: {filteredRecords.length}</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-600">Employee</th>
                  <th className="text-left p-4 font-medium text-gray-600">Department</th>
                  <th className="text-left p-4 font-medium text-gray-600">Month</th>
                  <th className="text-left p-4 font-medium text-gray-600">Basic Salary</th>
                  <th className="text-left p-4 font-medium text-gray-600">OT Payment</th>
                  <th className="text-left p-4 font-medium text-gray-600">Total Salary</th>
                  <th className="text-left p-4 font-medium text-gray-600">Last Updated</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-500">
                      No payroll records found matching your criteria
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((record) => (
                    <tr key={record.salaryId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">{record.person.name}</div>
                          <div className="text-sm text-gray-500">ID: {record.personId}</div>
                          <div className="text-sm text-gray-500">{record.person.position}</div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{record.person.department}</td>
                      <td className="p-4 text-gray-900">{formatMonth(record.month)}</td>
                      <td className="p-4 text-gray-900 font-medium">
                        {record.basicSalary?.toLocaleString()} LKR
                      </td>
                      <td className="p-4 text-gray-900 font-medium">
                        {record.otPayment?.toLocaleString()} LKR
                      </td>
                      <td className="p-4 text-green-600 font-bold">
                        {record.totalSalary?.toLocaleString()} LKR
                      </td>
                      <td className="p-4 text-gray-500">
                        {formatTimeAgo(record.updatedAt)}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-700 p-1">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700 p-1">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredRecords.length > 0 && <Pagination />}
        </div>
      )}

      {/* Monthly Summary */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {months.map(month => {
            const monthRecords = salaryRecords.filter(r => formatMonth(r.month) === month);
            const monthTotal = monthRecords.reduce((sum, r) => sum + (r.totalSalary || 0), 0);
            const monthOT = monthRecords.reduce((sum, r) => sum + (r.otPayment || 0), 0);
            
            return (
              <div key={month} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{month}</h4>
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employees:</span>
                    <span className="font-medium">{monthRecords.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Payroll:</span>
                    <span className="font-medium text-green-600">{monthTotal.toLocaleString()} LKR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">OT Payments:</span>
                    <span className="font-medium text-orange-600">{monthOT.toLocaleString()} LKR</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Payroll;