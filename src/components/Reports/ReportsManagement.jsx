import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search, 
  RefreshCw, 
  BarChart3,
  Loader2,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Users,
  Truck,
  MapPin,
  DollarSign,
  Package,
  Leaf,
  Clock,
  Eye
} from "lucide-react";

const ReportsManagement = () => {
  const [reportConfig, setReportConfig] = useState({
    reportType: "",
    fromDate: "",
    toDate: "",
    downloadType: "pdf",
    additionalFilters: {}
  });
  const [reportData, setReportData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasGeneratedReport, setHasGeneratedReport] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Report types configuration
  const reportTypes = [
    {
      value: "vehicle",
      label: "Vehicle Reports",
      icon: Truck,
      description: "Vehicle usage, maintenance, and fleet status",
      sampleColumns: ["Vehicle ID", "Plate Number", "Type", "Status", "Last Updated"]
    },
    {
      value: "salary",
      label: "Salary Reports",
      icon: DollarSign,
      description: "Employee payroll and compensation data",
      sampleColumns: ["Employee ID", "Name", "Department", "Basic Salary", "OT Payment", "Total"]
    },
    {
      value: "inventory",
      label: "Inventory Reports",
      icon: Package,
      description: "Stock levels, usage, and inventory movements",
      sampleColumns: ["Item ID", "Product Name", "Category", "Quantity", "Unit Price", "Status"]
    },
    {
      value: "tea_plucking",
      label: "Tea Plucking Reports",
      icon: Leaf,
      description: "Daily tea collection and worker productivity",
      sampleColumns: ["Date", "Worker", "Section", "Quantity (kg)", "Quality Grade", "Payment"]
    },
    {
      value: "tasks",
      label: "Task Reports",
      icon: CheckCircle,
      description: "Task assignments, completion, and productivity",
      sampleColumns: ["Task ID", "Assigned To", "Description", "Status", "Due Date", "Completed"]
    },
    {
      value: "locations",
      label: "Location Reports",
      icon: MapPin,
      description: "Farm sections, areas, and location-based data",
      sampleColumns: ["Location ID", "Section Name", "Area (acres)", "Crop Type", "Last Harvest"]
    },
    {
      value: "attendance",
      label: "Attendance Reports",
      icon: Users,
      description: "Employee attendance and working hours",
      sampleColumns: ["Employee", "Date", "Check In", "Check Out", "Hours Worked", "Status"]
    },
    {
      value: "production",
      label: "Production Reports",
      icon: BarChart3,
      description: "Daily production metrics and quality data",
      sampleColumns: ["Date", "Raw Tea (kg)", "Processed (kg)", "Quality Grade", "Efficiency %"]
    }
  ];

  // Mock data generator based on report type
  const generateMockData = (reportType, fromDate, toDate) => {
    const data = [];
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const recordCount = Math.min(Math.max(daysDiff, 5), 50); // Between 5-50 records

    for (let i = 0; i < recordCount; i++) {
      switch (reportType) {
        case "vehicle":
          data.push({
            "Vehicle ID": `VEH${String(i + 1).padStart(3, '0')}`,
            "Plate Number": `${['WP', 'CP', 'KA', 'SP'][i % 4]}-${1000 + i}`,
            "Type": ["Truck", "Van", "Pickup", "Tractor"][i % 4],
            "Status": ["Available", "In Use", "Maintenance"][i % 3],
            "Last Updated": new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
          });
          break;
        case "salary":
          data.push({
            "Employee ID": `EMP${String(i + 1).padStart(3, '0')}`,
            "Name": ["Samantha Perera", "Kamal Silva", "Nimal Fernando", "Priya Rajapaksa"][i % 4],
            "Department": ["Production", "Processing", "Quality Control", "Maintenance"][i % 4],
            "Basic Salary": `${(35000 + Math.random() * 50000).toFixed(0)} LKR`,
            "OT Payment": `${(Math.random() * 20000).toFixed(0)} LKR`,
            "Total": `${(40000 + Math.random() * 60000).toFixed(0)} LKR`
          });
          break;
        case "inventory":
          data.push({
            "Item ID": `ITM${String(i + 1).padStart(3, '0')}`,
            "Product Name": ["Green Tea Leaves", "Black Tea", "Fertilizer", "Tools"][i % 4],
            "Category": ["TEA", "TEA", "FERTILIZER", "TOOLS"][i % 4],
            "Quantity": `${(100 + Math.random() * 1000).toFixed(0)} kg`,
            "Unit Price": `${(50 + Math.random() * 500).toFixed(2)} LKR`,
            "Status": ["Good", "Low", "Critical"][i % 3]
          });
          break;
        case "tea_plucking":
          data.push({
            "Date": new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000)).toLocaleDateString(),
            "Worker": ["Kamala", "Siri", "Nanda", "Mala"][i % 4],
            "Section": [`Section ${String.fromCharCode(65 + (i % 5))}`],
            "Quantity (kg)": `${(15 + Math.random() * 35).toFixed(1)} kg`,
            "Quality Grade": ["A", "B", "C"][i % 3],
            "Payment": `${(800 + Math.random() * 1200).toFixed(0)} LKR`
          });
          break;
        case "tasks":
          data.push({
            "Task ID": `TSK${String(i + 1).padStart(3, '0')}`,
            "Assigned To": ["John Doe", "Jane Smith", "Mike Wilson"][i % 3],
            "Description": ["Harvest Section A", "Machine Maintenance", "Quality Check"][i % 3],
            "Status": ["Completed", "In Progress", "Pending"][i % 3],
            "Due Date": new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            "Completed": ["Yes", "No", "Partial"][i % 3]
          });
          break;
        case "locations":
          data.push({
            "Location ID": `LOC${String(i + 1).padStart(3, '0')}`,
            "Section Name": `Section ${String.fromCharCode(65 + (i % 10))}`,
            "Area (acres)": `${(2 + Math.random() * 8).toFixed(1)} acres`,
            "Crop Type": ["Ceylon Tea", "Green Tea", "Black Tea"][i % 3],
            "Last Harvest": new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
          });
          break;
        case "attendance":
          data.push({
            "Employee": ["Samantha P.", "Kamal S.", "Nimal F.", "Priya R."][i % 4],
            "Date": new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000)).toLocaleDateString(),
            "Check In": `${7 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} AM`,
            "Check Out": `${4 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} PM`,
            "Hours Worked": `${(7 + Math.random() * 3).toFixed(1)} hrs`,
            "Status": ["Present", "Late", "Half Day"][i % 3]
          });
          break;
        case "production":
          data.push({
            "Date": new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000)).toLocaleDateString(),
            "Raw Tea (kg)": `${(500 + Math.random() * 1000).toFixed(0)} kg`,
            "Processed (kg)": `${(400 + Math.random() * 800).toFixed(0)} kg`,
            "Quality Grade": ["Premium", "Standard", "Basic"][i % 3],
            "Efficiency %": `${(75 + Math.random() * 20).toFixed(1)}%`
          });
          break;
        default:
          break;
      }
    }
    return data;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportConfig(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  // Generate report
  const handleGenerateReport = async () => {
    if (!reportConfig.reportType) {
      setError("Please select a report type");
      return;
    }
    if (!reportConfig.fromDate || !reportConfig.toDate) {
      setError("Please select both from and to dates");
      return;
    }
    if (new Date(reportConfig.fromDate) > new Date(reportConfig.toDate)) {
      setError("From date cannot be later than to date");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockData = generateMockData(
        reportConfig.reportType, 
        reportConfig.fromDate, 
        reportConfig.toDate
      );
      
      setReportData(mockData);
      setHasGeneratedReport(true);
    } catch (err) {
      setError("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  // Download report
  const handleDownloadReport = async () => {
    if (!hasGeneratedReport || reportData.length === 0) {
      setError("Please generate a report first");
      return;
    }

    setIsDownloading(true);

    try {
      const selectedReportType = reportTypes.find(rt => rt.value === reportConfig.reportType);
      const fileName = `${selectedReportType?.label.replace(/\s+/g, '_')}_${reportConfig.fromDate}_to_${reportConfig.toDate}`;
      
      if (reportConfig.downloadType === "excel") {
        await downloadExcel(fileName, reportData, selectedReportType);
      } else {
        await downloadPDF(fileName, reportData, selectedReportType);
      }
      
    } catch (err) {
      setError("Failed to download report");
      console.error("Download error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Download Excel file
  const downloadExcel = async (fileName, data, reportType) => {
    // Create workbook and worksheet
    const ws_data = [
      // Header row
      Object.keys(data[0] || {}),
      // Data rows
      ...data.map(row => Object.values(row))
    ];

    // Create CSV content (Excel compatible)
    const csvContent = ws_data.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    // Add BOM for proper Excel UTF-8 support
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { 
      type: 'application/vnd.ms-excel;charset=utf-8' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Download PDF file using jsPDF
  const downloadPDF = async (fileName, data, reportType) => {
    // Load jsPDF dynamically
    const jsPDF = (await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')).jsPDF;
    
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    // Add title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(reportType?.label || 'Report', 20, yPosition);
    yPosition += 10;

    // Add date range
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Date Range: ${reportConfig.fromDate} to ${reportConfig.toDate}`, 20, yPosition);
    yPosition += 10;

    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
    yPosition += 15;

    // Add table headers
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    
    const headers = Object.keys(data[0] || {});
    const columnWidth = (doc.internal.pageSize.width - 40) / headers.length;
    
    headers.forEach((header, index) => {
      doc.text(header, 20 + (index * columnWidth), yPosition);
    });
    yPosition += 8;

    // Add horizontal line
    doc.line(20, yPosition, doc.internal.pageSize.width - 20, yPosition);
    yPosition += 5;

    // Add data rows
    doc.setFont(undefined, 'normal');
    data.forEach((row, rowIndex) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      Object.values(row).forEach((value, colIndex) => {
        const text = String(value);
        const maxWidth = columnWidth - 5;
        
        // Handle text wrapping for long content
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines[0] || '', 20 + (colIndex * columnWidth), yPosition);
      });
      yPosition += 6;
    });

    // Add footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${totalPages} | Tea Factory Management System`,
        20,
        pageHeight - 10
      );
    }

    // Save the PDF
    doc.save(`${fileName}.pdf`);
  };

  // Get current date for max date input
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get date 30 days ago for default from date
  const getDefaultFromDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  };

  // Calculate report stats
  const getReportStats = () => {
    if (!hasGeneratedReport || !reportData.length) return null;

    const totalRecords = reportData.length;
    const dateRange = `${reportConfig.fromDate} to ${reportConfig.toDate}`;
    const selectedReportType = reportTypes.find(rt => rt.value === reportConfig.reportType);

    return {
      totalRecords,
      dateRange,
      reportType: selectedReportType?.label,
      generatedAt: new Date().toLocaleString()
    };
  };

  const stats = getReportStats();

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Reports & Analytics</h2>
            <p className="text-sm text-gray-600 mt-1">Generate and download comprehensive reports</p>
          </div>
          <FileText className="h-8 w-8 text-green-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type *
              </label>
              <select
                name="reportType"
                value={reportConfig.reportType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select report type</option>
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {reportConfig.reportType && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  {React.createElement(reportTypes.find(rt => rt.value === reportConfig.reportType)?.icon, {
                    className: "h-4 w-4 text-blue-600 mt-0.5"
                  })}
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {reportTypes.find(rt => rt.value === reportConfig.reportType)?.label}
                    </p>
                    <p className="text-xs text-blue-700">
                      {reportTypes.find(rt => rt.value === reportConfig.reportType)?.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date *
                </label>
                <input
                  type="date"
                  name="fromDate"
                  value={reportConfig.fromDate}
                  onChange={handleInputChange}
                  max={getCurrentDate()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date *
                </label>
                <input
                  type="date"
                  name="toDate"
                  value={reportConfig.toDate}
                  onChange={handleInputChange}
                  max={getCurrentDate()}
                  min={reportConfig.fromDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Download Format
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="downloadType"
                    value="pdf"
                    checked={reportConfig.downloadType === "pdf"}
                    onChange={handleInputChange}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">PDF</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="downloadType"
                    value="excel"
                    checked={reportConfig.downloadType === "excel"}
                    onChange={handleInputChange}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Excel</span>
                </label>
              </div>
            </div>
          </div>

          {/* Preview & Actions */}
          <div className="space-y-4">
            {reportConfig.reportType && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Report Preview</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  {reportTypes.find(rt => rt.value === reportConfig.reportType)?.sampleColumns.map((col, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
                      <span>{col}</span>
                      <span className="text-gray-400">...</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating || !reportConfig.reportType || !reportConfig.fromDate || !reportConfig.toDate}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </button>

              {hasGeneratedReport && (
                <button
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download {reportConfig.downloadType.toUpperCase()}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Report Stats */}
      {stats && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Records</p>
                  <p className="text-xl font-bold text-green-900 mt-1">{stats.totalRecords}</p>
                </div>
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Report Type</p>
                  <p className="text-sm font-bold text-blue-900 mt-1">{stats.reportType}</p>
                </div>
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Date Range</p>
                  <p className="text-xs font-medium text-purple-900 mt-1">{stats.dateRange}</p>
                </div>
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Generated</p>
                  <p className="text-xs font-medium text-orange-900 mt-1">{stats.generatedAt}</p>
                </div>
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generated Report Data */}
      {hasGeneratedReport && reportData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Generated Report Data
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{reportData.length} records</span>
                <button
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm flex items-center"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </button>
              </div>
            </div>
          </div>

          {isMobile ? (
            /* Mobile Card View */
            <div className="p-4 space-y-3">
              {reportData.slice(0, 10).map((row, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="space-y-2">
                    {Object.entries(row).map(([key, value], idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">{key}:</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {reportData.length > 10 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    Showing first 10 of {reportData.length} records. Download the full report to view all data.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Desktop Table View */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {Object.keys(reportData[0] || {}).map((header, index) => (
                      <th key={index} className="text-left p-4 font-medium text-gray-600">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.slice(0, 15).map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      {Object.values(row).map((value, idx) => (
                        <td key={idx} className="p-4 text-gray-900 text-sm">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {reportData.length > 15 && (
                <div className="p-4 text-center border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Showing first 15 of {reportData.length} records. Download the full report to view all data.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Report Templates */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Report Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button 
            onClick={() => {
              setReportConfig({
                reportType: "tea_plucking",
                fromDate: getDefaultFromDate(),
                toDate: getCurrentDate(),
                downloadType: "excel"
              });
            }}
            className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
          >
            <Leaf className="h-5 w-5 text-gray-400 group-hover:text-green-600 mr-2" />
            <span className="text-gray-600 group-hover:text-green-600 font-medium text-sm">
              Monthly Tea Collection
            </span>
          </button>
          
          <button 
            onClick={() => {
              setReportConfig({
                reportType: "salary",
                fromDate: getDefaultFromDate(),
                toDate: getCurrentDate(),
                downloadType: "pdf"
              });
            }}
            className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <DollarSign className="h-5 w-5 text-gray-400 group-hover:text-blue-600 mr-2" />
            <span className="text-gray-600 group-hover:text-blue-600 font-medium text-sm">
              Payroll Summary
            </span>
          </button>
          
          <button 
            onClick={() => {
              setReportConfig({
                reportType: "vehicle",
                fromDate: getDefaultFromDate(),
                toDate: getCurrentDate(),
                downloadType: "excel"
              });
            }}
            className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
          >
            <Truck className="h-5 w-5 text-gray-400 group-hover:text-purple-600 mr-2" />
            <span className="text-gray-600 group-hover:text-purple-600 font-medium text-sm">
              Fleet Status
            </span>
          </button>
          
          <button 
            onClick={() => {
              setReportConfig({
                reportType: "inventory",
                fromDate: getDefaultFromDate(),
                toDate: getCurrentDate(),
                downloadType: "pdf"
              });
            }}
            className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group"
          >
            <Package className="h-5 w-5 text-gray-400 group-hover:text-orange-600 mr-2" />
            <span className="text-gray-600 group-hover:text-orange-600 font-medium text-sm">
              Stock Report
            </span>
          </button>
        </div>
      </div>

      {/* Report History */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {[
            {
              name: "Vehicle Fleet Report",
              type: "PDF",
              date: "2024-08-01",
              size: "2.4 MB",
              status: "Completed"
            },
            {
              name: "Monthly Payroll Summary",
              type: "Excel",
              date: "2024-07-31",
              size: "1.8 MB",
              status: "Completed"
            },
            {
              name: "Tea Collection Report",
              type: "PDF",
              date: "2024-07-30",
              size: "3.1 MB",
              status: "Completed"
            },
            {
              name: "Inventory Stock Report",
              type: "Excel",
              date: "2024-07-29",
              size: "2.7 MB",
              status: "Completed"
            }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{report.name}</h4>
                  <p className="text-xs text-gray-500">
                    {report.type} • {report.size} • {report.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {report.status}
                </span>
                {!isMobile && (
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <Download className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Analytics */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Analytics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Most Generated</p>
                <p className="text-lg font-bold text-green-900 mt-1">Tea Plucking</p>
                <p className="text-xs text-green-600">45 reports this month</p>
              </div>
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Downloads</p>
                <p className="text-lg font-bold text-blue-900 mt-1">127</p>
                <p className="text-xs text-blue-600">This month</p>
              </div>
              <Download className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Preferred Format</p>
                <p className="text-lg font-bold text-purple-900 mt-1">Excel</p>
                <p className="text-xs text-purple-600">68% of downloads</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement;