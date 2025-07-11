import React from 'react'

const Production = () => {
  return (
    {/* Production Page */}
          {activeTab === 'production' && (
            <div className="space-y-6">
              {/* Production Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Today's Production</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">2,847 kg</p>
                      <p className="text-sm text-green-600 mt-1">Target: 3,000 kg</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Factory className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Batches</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                      <p className="text-sm text-blue-600 mt-1">Processing: 8</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Quality Rate</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">94.2%</p>
                      <p className="text-sm text-green-600 mt-1">+2.1% from yesterday</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Production Batches */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Production Batches</h3>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Start New Batch
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-4 font-medium text-gray-600">Batch ID</th>
                        <th className="text-left p-4 font-medium text-gray-600">Tea Type</th>
                        <th className="text-left p-4 font-medium text-gray-600">Quantity</th>
                        <th className="text-left p-4 font-medium text-gray-600">Status</th>
                        <th className="text-left p-4 font-medium text-gray-600">Started</th>
                        <th className="text-left p-4 font-medium text-gray-600">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: '#2847', type: 'Black Tea', quantity: '450 kg', status: 'Processing', started: '2 hours ago', progress: 75 },
                        { id: '#2846', type: 'Green Tea', quantity: '320 kg', status: 'Quality Check', started: '4 hours ago', progress: 90 },
                        { id: '#2845', type: 'White Tea', quantity: '180 kg', status: 'Drying', started: '6 hours ago', progress: 60 },
                        { id: '#2844', type: 'Oolong Tea', quantity: '280 kg', status: 'Completed', started: '1 day ago', progress: 100 },
                        { id: '#2843', type: 'Black Tea', quantity: '520 kg', status: 'Packaging', started: '1 day ago', progress: 95 }
                      ].map((batch, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">{batch.id}</td>
                          <td className="p-4 text-gray-600">{batch.type}</td>
                          <td className="p-4 text-gray-600">{batch.quantity}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              batch.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              batch.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                              batch.status === 'Quality Check' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {batch.status}
                            </span>
                          </td>
                          <td className="p-4 text-gray-500">{batch.started}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${batch.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{batch.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Page */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Inventory Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Stock</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">18,234 kg</p>
                    </div>
                    <Package className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                      <p className="text-2xl font-bold text-red-600 mt-1">3</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Categories</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">6</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Value</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">$284K</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Inventory Management</h3>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Export
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Add Stock
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-4 font-medium text-gray-600">Product</th>
                        <th className="text-left p-4 font-medium text-gray-600">Category</th>
                        <th className="text-left p-4 font-medium text-gray-600">Stock</th>
                        <th className="text-left p-4 font-medium text-gray-600">Min. Level</th>
                        <th className="text-left p-4 font-medium text-gray-600">Price/kg</th>
                        <th className="text-left p-4 font-medium text-gray-600">Status</th>
                        <th className="text-left p-4 font-medium text-gray-600">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { product: 'Premium Black Tea', category: 'Black Tea', stock: 2850, min: 500, price: 18.50, status: 'Good', updated: '2 hours ago' },
                        { product: 'Green Tea Leaves', category: 'Green Tea', stock: 1420, min: 300, price: 22.00, status: 'Good', updated: '1 day ago' },
                        { product: 'Earl Grey Blend', category: 'Flavored', stock: 180, min: 200, price: 28.00, status: 'Low', updated: '3 hours ago' },
                        { product: 'White Tea', category: 'White Tea', stock: 890, min: 150, price: 45.00, status: 'Good', updated: '1 day ago' },
                        { product: 'Oolong Special', category: 'Oolong', stock: 95, min: 100, price: 35.50, status: 'Critical', updated: '30 min ago' },
                        { product: 'Jasmine Green', category: 'Flavored', stock: 650, min: 200, price: 25.00, status: 'Good', updated: '5 hours ago' }
                      ].map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">{item.product}</td>
                          <td className="p-4 text-gray-600">{item.category}</td>
                          <td className="p-4 text-gray-900 font-medium">{item.stock.toLocaleString()} kg</td>
                          <td className="p-4 text-gray-600">{item.min} kg</td>
                          <td className="p-4 text-gray-900">${item.price}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'Good' ? 'bg-green-100 text-green-800' :
                              item.status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4 text-gray-500">{item.updated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Workers Page */}
          {activeTab === 'workers' && (
            <div className="space-y-6">
              {/* Worker Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Workers</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">156</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Present Today</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">142</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">On Leave</p>
                      <p className="text-2xl font-bold text-yellow-600 mt-1">8</p>
                    </div>
                    <Calendar className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Absent</p>
                      <p className="text-2xl font-bold text-red-600 mt-1">6</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </div>

              {/* Workers Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Worker Management</h3>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Mark Attendance
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Add Worker
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-4 font-medium text-gray-600">Worker ID</th>
                        <th className="text-left p-4 font-medium text-gray-600">Name</th>
                        <th className="text-left p-4 font-medium text-gray-600">Department</th>
                        <th className="text-left p-4 font-medium text-gray-600">Shift</th>
                        <th className="text-left p-4 font-medium text-gray-600">Status</th>
                        <th className="text-left p-4 font-medium text-gray-600">Performance</th>
                        <th className="text-left p-4 font-medium text-gray-600">Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'W001', name: 'Kumara Silva', dept: 'Plucking', shift: 'Morning', status: 'Present', performance: 92, contact: '+94 77 123 4567' },
                        { id: 'W002', name: 'Nimal Perera', dept: 'Processing', shift: 'Day', status: 'Present', performance: 88, contact: '+94 71 234 5678' },
                        { id: 'W003', name: 'Kamala Fernando', dept: 'Packaging', shift: 'Evening', status: 'On Leave', performance: 95, contact: '+94 76 345 6789' },
                        { id: 'W004', name: 'Sunil Jayasinghe', dept: 'Quality Control', shift: 'Morning', status: 'Present', performance: 89, contact: '+94 78 456 7890' },
                        { id: 'W005', name: 'Priya Mendis', dept: 'Plucking', shift: 'Morning', status: 'Absent', performance: 76, contact: '+94 77 567 8901' },
                        { id: 'W006', name: 'Ravi Gunasekara', dept: 'Processing', shift: 'Day', status: 'Present', performance: 91, contact: '+94 75 678 9012' }
                      ].map((worker, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">{worker.id}</td>
                          <td className="p-4 text-gray-900">{worker.name}</td>
                          <td className="p-4 text-gray-600">{worker.dept}</td>
                          <td className="p-4 text-gray-600">{worker.shift}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              worker.status === 'Present' ? 'bg-green-100 text-green-800' :
                              worker.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {worker.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    worker.performance >= 90 ? 'bg-green-600' :
                                    worker.performance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${worker.performance}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{worker.performance}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600 text-sm">{worker.contact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Other Tab Content Placeholders */}
          {!['dashboard', 'production', 'inventory', 'workers'].includes(activeTab) && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="text-gray-400 mb-4">
                <Factory className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 capitalize">{activeTab} Section</h3>
              <p className="text-gray-600">This section is under development. The {activeTab} management features will be available soon.</p>
            </div>
          )}
  )
}

export default Production