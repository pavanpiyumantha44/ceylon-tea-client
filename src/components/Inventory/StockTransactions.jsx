import React, { useState, useEffect } from "react";
import { 
  Package, 
  AlertTriangle, 
  BarChart3, 
  DollarSign, 
  Search, 
  RefreshCw, 
  Download, 
  Plus, 
  X, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { addStockItem, getStockItems } from "../../services/stockService";
import { Link } from "react-router-dom";
import { getTransactions } from "../../services/stockTransactionsService";

const StockTransactions = () => {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
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


  const fetchStockTransactionData = async () => {
    try {
      setLoading(true);
      const stockTransactionsResponse = await getTransactions();
      if(stockTransactionsResponse.data.success){   
        console.log(stockTransactionsResponse.data) 
        setStockItems(stockTransactionsResponse.data.data);
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch stock data");
      console.error("Error fetching stock:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockTransactionData();
  }, []);

  // Define minimum stock levels by category
  const minStockLevels = {
    "TEA": 500,
    "FERTILIZER": 300,
    "TOOLS": 20,
    "FUEL": 100,
  };
  // Calculate stock status
  const getStockStatus = (quantity, category) => {
    const minLevel = minStockLevels[category] || 100;
    if (quantity <= minLevel * 0.5) return "Critical";
    if (quantity <= minLevel) return "Low";
    return "Good";
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

  // Filter stock items
  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, itemsPerPage]);

  // Calculate stats
  const totalStock = stockItems.length;
  const lowStockItems = stockItems.filter(item => 
    getStockStatus(item.quantity, item.category) === "Low" || 
    getStockStatus(item.quantity, item.category) === "Critical"
  ).length;
  const categories = [...new Set(stockItems.map(item => item.category))];
  const totalValue = stockItems.reduce((sum, item) => 
    sum + (item.quantity * Number(item.unitPrice)), 0
  );

  // Add Stock Modal Component
  const AddStockModal = () => {
    const [formData, setFormData] = useState({
      name: "",
      category: "",
      quantity: '',
      unit: "kg",
      unitPrice:'',
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const availableCategories = ['TEA','FERTILIZER','TOOLS','FUEL'];


    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
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
        const stockResponse = await addStockItem(formData);
        if(stockResponse.data.success){
          console.log(stockResponse.data);
        }
        
        const newItem = {
          itemId: (stockItems.length + 1).toString(),
          name: formData.name.trim(),
          category: formData.category,
          unit: formData.unit,
          quantity: Number(formData.quantity),
          unitPrice:Number(formData.unitPrice),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setStockItems(prev => [...prev, newItem]);
        
        // Reset form
        setFormData({
          name: "",
          category: "",
          quantity: "",
          unit: "kg",
          unitPrice:""
        });
        setFormErrors({});
        setShowAddModal(false);
        
      } catch (error) {
        console.error("Error adding stock:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleClose = () => {
      setShowAddModal(false);
      setFormData({
        name: "",
        category: "",
        quantity: "",
        unit: "kg"
      });
      setFormErrors({});
    };
  };

  // Mobile Card Component
  const MobileCard = ({ item }) => {
    const status = getStockStatus(item.quantity, item.category);
    const minLevel = minStockLevels[item.category] || 100;
    const price = item.unitPrice || 0;
    
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
            <p className="text-xs text-gray-500 mt-1">ID: {item.itemId}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "Good"
              ? "bg-green-100 text-green-800"
              : status === "Low"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}>
            {status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-500">Category</p>
            <p className="text-sm font-medium text-gray-900">{item.category}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Stock</p>
            <p className="text-sm font-medium text-gray-900">{item.quantity.toLocaleString()} {item.type.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Min Level</p>
            <p className="text-sm font-medium text-gray-900">{minLevel} {item.type.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <p className="text-sm font-medium text-gray-900">{price} LKR</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">{formatTimeAgo(item.createdAt)}</p>
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
            Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} results
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
            <span className="text-gray-600">Loading inventory Transactions...</span>
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
              onClick={fetchStockTransactionData}
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <button 
                onClick={fetchStockTransactionData}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                {!isMobile && "Refresh"}
              </button>
              
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-1" />
                {!isMobile && "Export"}
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
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            currentItems.map((item) => (
              <MobileCard key={item.itemId} item={item} />
            ))
          )}
          {filteredItems.length > 0 && <Pagination />}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Stock Transactions
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-600">Transaction ID</th>
                  <th className="text-left p-4 font-medium text-gray-600">Item</th>
                  <th className="text-left p-4 font-medium text-gray-600">Task</th>
                  <th className="text-left p-4 font-medium text-gray-600">Date</th>
                  <th className="text-left p-4 font-medium text-gray-600">Type</th>
                  <th className="text-left p-4 font-medium text-gray-600">Quantity</th>
                  <th className="text-left p-4 font-medium text-gray-600">References</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No items found matching your criteria
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item) => {
                    const localDate  = new Date(item.date).toLocaleString();
                    
                    return (
                      <tr key={item.transactionId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 font-medium text-sm text-gray-900">{item.transactionId}</td>
                        <td className="p-4 text-gray-900">{item.item.name}</td>
                        <td className="p-4 text-gray-900 font-medium">
                        {item.taskId}
                        </td>
                        <td className="p-4 text-gray-600">{localDate}</td>
                        <td className="p-4 text-gray-900">{item.type}</td>
                        <td className="p-4 text-gray-900">{item.quantity}</td>
                        <td className="p-4 text-gray-500">{item.reference}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {filteredItems.length > 0 && <Pagination />}
        </div>
      )}
    </div>
  );
};

export default StockTransactions;