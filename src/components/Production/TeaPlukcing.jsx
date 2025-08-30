import React, { useState, useEffect } from "react";
import { 
  Leaf, 
  Users, 
  Calendar, 
  Weight,
  DollarSign,
  Search, 
  RefreshCw, 
  Download, 
  Plus, 
  X, 
  Check,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  User,
  Clock,
  Save
} from "lucide-react";
import { allTeaPluckers } from "../../services/workerService";
import { addBulkTeaPlucking, addSingleTeaPlucking, getTeaRecords } from "../../services/teaPluckingService";
import { ToastContainer, toast } from 'react-toastify';

const TeaPlucking = () => {
  const [pluckingRecords, setPluckingRecords] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobile, setIsMobile] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkEntryModal, setShowBulkEntryModal] = useState(false);
  const [ratePerKg, setRatePerKg] = useState(250);
  const [reload,setReload] = useState(false);

  // Mock workers data - replace with actual API call
  const mockWorkers = [
    { personId: "1", name: "Sunil Perera", type: "WORKER", isActive: "Y" },
    { personId: "2", name: "Kamala Silva", type: "WORKER", isActive: "Y" },
    { personId: "3", name: "Ravi Fernando", type: "WORKER", isActive: "Y" },
    { personId: "4", name: "Nimalka Jayasinghe", type: "WORKER", isActive: "Y" },
    { personId: "5", name: "Bandula Wickrama", type: "WORKER", isActive: "Y" },
    { personId: "6", name: "Priyanka Kumari", type: "WORKER", isActive: "Y" },
    { personId: "7", name: "Ajith Rathnayake", type: "WORKER", isActive: "Y" },
    { personId: "8", name: "Malini Gunawardena", type: "WORKER", isActive: "Y" },
  ];

  // Mock plucking records - replace with actual API call
  const mockPluckingRecords = [
    {
      tpId: "1",
      personId: "1",
      date: "2025-08-30",
      weightKg: 45.5,
      ratePerKg: 250,
      totalPayment: 11375,
      person: { name: "Sunil Perera" },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      tpId: "2",
      personId: "2",
      date: "2025-08-30",
      weightKg: 38.2,
      ratePerKg: 250,
      totalPayment: 9550,
      person: { name: "Kamala Silva" },
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ];

  // Check for mobile screen
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const getWorkersResponse = await allTeaPluckers();
      if(getWorkersResponse.data.success){
        setWorkers(getWorkersResponse.data.workers);
      }
  const TeaRecordsResponse = await getTeaRecords();
    if (TeaRecordsResponse.data.success) {
      const mappedData = TeaRecordsResponse.data.data.map(record => ({
        tpId: record.tpId,
        personId: record.personId,
        date: record.date ? new Date(record.date).toISOString().split("T")[0] : null,
        weightKg: record.weightKg,
        ratePerKg: record.ratePerKg,
        totalPayment: record.totalPayment,
        person: { name: record.person?.firstName || "Unknown" },
        createdAt: new Date(record.createdAt),
        updatedAt: record.updatedAt ? new Date(record.updatedAt) : new Date()
      }));
      setPluckingRecords(mappedData);
    }
      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

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

  // Filter records
  const filteredRecords = pluckingRecords.filter(record => {
    const matchesSearch = record.person.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = record.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredRecords.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDate, itemsPerPage]);

  // Calculate stats
  const todayRecords = pluckingRecords.filter(r => r.date === selectedDate);
  const totalWeight = todayRecords.reduce((sum, r) => sum + r.weightKg, 0);
  const totalPayment = todayRecords.reduce((sum, r) => sum + r.totalPayment, 0);
  const workersCount = todayRecords.length;

  // Single Entry Modal
  const SingleEntryModal = () => {
    const [formData, setFormData] = useState({
      personId: "",
      weightKg: "",
      ratePerKg: ratePerKg,
      date: selectedDate
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
      const errors = {};
      
      if (!formData.personId) {
        errors.personId = "Please select a worker";
      }
      
      if (!formData.weightKg) {
        errors.weightKg = "Weight is required";
      } else if (isNaN(formData.weightKg) || Number(formData.weightKg) <= 0) {
        errors.weightKg = "Weight must be a positive number";
      }
      
      if (!formData.ratePerKg) {
        errors.ratePerKg = "Rate per kg is required";
      } else if (isNaN(formData.ratePerKg) || Number(formData.ratePerKg) <= 0) {
        errors.ratePerKg = "Rate must be a positive number";
      }
      
      return errors;
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      if (formErrors[name]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
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
        const selectedWorker = workers.find(w => w.personId === formData.personId);
        const totalPayment = Number(formData.weightKg) * Number(formData.ratePerKg);
        
        const newRecord = {
          personId: formData.personId,
          date: formData.date,
          weightKg: Number(formData.weightKg),
          ratePerKg: Number(formData.ratePerKg),
          totalPayment: totalPayment,
          person: { name: selectedWorker.firstName },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const addTeaPluckingResponse = await addSingleTeaPlucking(newRecord);
        if(addTeaPluckingResponse.data.success){
          console.log(addTeaPluckingResponse.data.data);
        }
        setPluckingRecords(prev => [...prev, newRecord]);
        
        // Reset form
        setFormData({
          personId: "",
          weightKg: "",
          ratePerKg: ratePerKg,
          date: selectedDate
        });
        setFormErrors({});
        setShowAddModal(false);
        
      } catch (error) {
        console.error("Error adding record:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleClose = () => {
      setShowAddModal(false);
      setFormData({
        personId: "",
        weightKg: "",
        ratePerKg: ratePerKg,
        date: selectedDate
      });
      setFormErrors({});
    };

    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Add Tea Plucking Record</h3>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="personId" className="block text-sm font-medium text-gray-700 mb-1">
                Worker *
              </label>
              <select
                id="personId"
                name="personId"
                value={formData.personId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  formErrors.personId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a worker</option>
                {workers.filter(w => w.isDeleted === "N").map(worker => (
                  <option key={worker.personId} value={worker.personId}>
                    {worker.personCode}-{`${worker.firstName} ${worker.lastName}`}
                  </option>
                ))}
              </select>
              {formErrors.personId && (
                <p className="text-red-500 text-xs mt-1">{formErrors.personId}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="weightKg" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  id="weightKg"
                  name="weightKg"
                  value={formData.weightKg}
                  onChange={handleInputChange}
                  placeholder="0.0"
                  step="0.01"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    formErrors.weightKg ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formErrors.weightKg && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.weightKg}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="ratePerKg" className="block text-sm font-medium text-gray-700 mb-1">
                  Rate/kg (LKR) *
                </label>
                <input
                  type="number"
                  id="ratePerKg"
                  name="ratePerKg"
                  value={formData.ratePerKg}
                  onChange={handleInputChange}
                  placeholder="250"
                  step="0.01"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    formErrors.ratePerKg ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formErrors.ratePerKg && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.ratePerKg}</p>
                )}
              </div>
            </div>

            {formData.weightKg && formData.ratePerKg && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Payment:</span>
                  <span className="text-lg font-semibold text-green-600">
                    {(Number(formData.weightKg || 0) * Number(formData.ratePerKg || 0)).toLocaleString()} LKR
                  </span>
                </div>
              </div>
            )}

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
                  "Add Record"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Bulk Entry Modal
  const BulkEntryModal = () => {
    const [bulkData, setBulkData] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bulkDate, setBulkDate] = useState(selectedDate);
    const [bulkRate, setBulkRate] = useState(ratePerKg);

    useEffect(() => {
      if (showBulkEntryModal) {
        // Initialize bulk data with all active workers
        const initialData = workers
          .filter(w => w.isDeleted === "N")
          .map(worker => ({
            personId: worker.personId,
            name: worker.firstName,
            weightKg: "",
            error: ""
          }));
        setBulkData(initialData);
      }
    }, [showBulkEntryModal, workers]);

    const handleWeightChange = (personId, value) => {
      setBulkData(prev => prev.map(item => 
        item.personId === personId 
          ? { ...item, weightKg: value, error: "" }
          : item
      ));
    };

    const handleBulkSubmit = async () => {
      const validEntries = bulkData.filter(item => 
        item.weightKg && Number(item.weightKg) > 0
      );

      if (validEntries.length === 0) {
        alert("Please enter at least one valid weight");
        return;
      }

      setIsSubmitting(true);
      
      try {
        const newRecords = validEntries.map(item => ({
          personId: item.personId,
          date: new Date(bulkDate),
          weightKg: Number(item.weightKg),
          ratePerKg: Number(bulkRate),
          totalPayment: Number(item.weightKg) * Number(bulkRate),
          person: { name: item.name },
          createdAt: new Date(),
          updatedAt: new Date()
        }));
        const bulkAddResponse = await addBulkTeaPlucking(newRecords);
        if(bulkAddResponse.data.success){
           const { results } = bulkAddResponse.data;
           const skippedRecords = results.filter(r => r.status === "skipped");
            if (skippedRecords.length > 0) {
              const skippedMsg = skippedRecords
                .map(r => `Person ID: ${r.personId} - ${r.reason}`)
                .join("\n");
              toast.error(skippedMsg, {
                position: 'top-center',
              });
            }
          console.log(bulkAddResponse.data);
          const insertedRecords = results.filter(r => r.status === "inserted");
          if (insertedRecords.length > 0) {
            setPluckingRecords(prev => [...prev, ...insertedRecords]);
          }
          setShowBulkEntryModal(false);
          setBulkData([]);
          setReload(!reload);
        }
        
      } catch (error) {
        console.error("Error adding bulk records:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleClose = () => {
      setShowBulkEntryModal(false);
      setBulkData([]);
    };

    if (!showBulkEntryModal) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Bulk Tea Plucking Entry</h3>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={bulkDate}
                  onChange={(e) => setBulkDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate per kg (LKR) *
                </label>
                <input
                  type="number"
                  value={bulkRate}
                  onChange={(e) => setBulkRate(Number(e.target.value))}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex items-end">
                <div className="bg-green-50 p-2 rounded-lg w-full">
                  <span className="text-xs text-gray-600">Total Records: </span>
                  <span className="font-semibold text-green-600">
                    {bulkData.filter(item => item.weightKg && Number(item.weightKg) > 0).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-600">Worker Name</th>
                    <th className="text-left p-3 font-medium text-gray-600">Weight (kg)</th>
                    <th className="text-left p-3 font-medium text-gray-600">Payment (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkData.map((item, index) => (
                    <tr key={item.personId} className="border-b border-gray-100">
                      <td className="p-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          {item.name}
                        </div>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={item.weightKg}
                          onChange={(e) => handleWeightChange(item.personId, e.target.value)}
                          placeholder="0.0"
                          step="0.1"
                          min="0"
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </td>
                      <td className="p-3">
                        <span className="text-sm font-medium text-gray-900">
                          {item.weightKg ? (Number(item.weightKg) * bulkRate).toLocaleString() : "0"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save All Records
                  </>
                )}
              </button>
            </div>
          </div>
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
            <h4 className="font-semibold text-gray-900 text-sm flex items-center">
              <User className="h-4 w-4 text-gray-400 mr-1" />
              {record.person.name}
            </h4>
            <p className="text-xs text-gray-500 mt-1">ID: {record.tpId}</p>
          </div>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Active
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-500">Weight</p>
            <p className="text-sm font-medium text-gray-900 flex items-center">
              <Weight className="h-3 w-3 text-gray-400 mr-1" />
              {record.weightKg} kg
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Rate/kg</p>
            <p className="text-sm font-medium text-gray-900">{record.ratePerKg} LKR</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Total Payment</p>
            <p className="text-lg font-semibold text-green-600">
              {record.totalPayment.toLocaleString()} LKR
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatTimeAgo(record.createdAt)}
          </p>
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
            Showing {startIndex + 1} to {Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length} results
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
            <span className="text-gray-600">Loading tea plucking records...</span>
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
              onClick={fetchData}
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
      <ToastContainer autoClose={2000} />
      {/* Modals */}
      <SingleEntryModal />
      <BulkEntryModal />

      {/* Daily Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Weight Today</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {totalWeight.toFixed(1)} kg
              </p>
            </div>
            <Weight className="h-6 w-6 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Workers Count</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{workersCount}</p>
            </div>
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payment</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{totalPayment.toLocaleString()} LKR</p>
            </div>
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. per Worker</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {workersCount > 0 ? (totalWeight / workersCount).toFixed(1) : 0} kg
              </p>
            </div>
            <Leaf className="h-6 w-6 text-green-600" />
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
                placeholder="Search workers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={fetchData}
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
                onClick={() => setShowBulkEntryModal(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Users className="h-4 w-4 mr-1" />
                {!isMobile && "Bulk Entry"}
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
          {currentItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or add new records</p>
            </div>
          ) : (
            currentItems.map((record) => (
              <MobileCard key={record.tpId} record={record} />
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
                Tea Plucking Records - {selectedDate}
              </h3>
              <div className="text-sm text-gray-500">
                {filteredRecords.length} records found
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-600">Worker</th>
                  <th className="text-left p-4 font-medium text-gray-600">Weight (kg)</th>
                  <th className="text-left p-4 font-medium text-gray-600">Rate/kg</th>
                  <th className="text-left p-4 font-medium text-gray-600">Total Payment</th>
                  <th className="text-left p-4 font-medium text-gray-600">Time</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No records found for {selectedDate}
                    </td>
                  </tr>
                ) : (
                  currentItems.map((record) => (
                    <tr key={record.personId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">{record.person.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-900 flex items-center">
                          <Weight className="h-4 w-4 text-gray-400 mr-1" />
                          {record.weightKg} kg
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{record.ratePerKg} LKR</td>
                      <td className="p-4">
                        <span className="font-semibold text-green-600">
                          {record.totalPayment.toLocaleString()} LKR
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {formatTimeAgo(record.createdAt)}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
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
    </div>
  );
};

export default TeaPlucking;