import {
  Menu,
  X,
  Home,
  Users,
  Package,
  TrendingUp,
  Settings,
  Bell,
  Search,
  Leaf,
  Factory,
  Truck,
  DollarSign,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Inventory = () => {
  return (
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
              <p className="text-sm font-medium text-gray-600">
                Low Stock Items
              </p>
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
            <h3 className="text-lg font-semibold text-gray-800">
              Inventory Management
            </h3>
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
                <th className="text-left p-4 font-medium text-gray-600">
                  Product
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Category
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Stock
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Min. Level
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Price/kg
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  product: "Premium Black Tea",
                  category: "Black Tea",
                  stock: 2850,
                  min: 500,
                  price: 18.5,
                  status: "Good",
                  updated: "2 hours ago",
                },
                {
                  product: "Green Tea Leaves",
                  category: "Green Tea",
                  stock: 1420,
                  min: 300,
                  price: 22.0,
                  status: "Good",
                  updated: "1 day ago",
                },
                {
                  product: "Earl Grey Blend",
                  category: "Flavored",
                  stock: 180,
                  min: 200,
                  price: 28.0,
                  status: "Low",
                  updated: "3 hours ago",
                },
                {
                  product: "White Tea",
                  category: "White Tea",
                  stock: 890,
                  min: 150,
                  price: 45.0,
                  status: "Good",
                  updated: "1 day ago",
                },
                {
                  product: "Oolong Special",
                  category: "Oolong",
                  stock: 95,
                  min: 100,
                  price: 35.5,
                  status: "Critical",
                  updated: "30 min ago",
                },
                {
                  product: "Jasmine Green",
                  category: "Flavored",
                  stock: 650,
                  min: 200,
                  price: 25.0,
                  status: "Good",
                  updated: "5 hours ago",
                },
              ].map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-gray-900">
                    {item.product}
                  </td>
                  <td className="p-4 text-gray-600">{item.category}</td>
                  <td className="p-4 text-gray-900 font-medium">
                    {item.stock.toLocaleString()} kg
                  </td>
                  <td className="p-4 text-gray-600">{item.min} kg</td>
                  <td className="p-4 text-gray-900">${item.price}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "Good"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Low"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
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
  );
};

export default Inventory;
