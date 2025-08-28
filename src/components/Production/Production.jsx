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

const Production = () => {
  return (
    <div className="space-y-6">
      {/* Production Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Today's Production
              </p>
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
              <p className="text-sm font-medium text-gray-600">
                Active Batches
              </p>
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
              <p className="text-sm text-green-600 mt-1">
                +2.1% from yesterday
              </p>
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
            <h3 className="text-lg font-semibold text-gray-800">
              Production Batches
            </h3>
            <button
              onClick={() => setShowProductionForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Start New Batch
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-600">
                  Batch ID
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Tea Type
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Quantity
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Started
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "#2847",
                  type: "Black Tea",
                  quantity: "450 kg",
                  status: "Processing",
                  started: "2 hours ago",
                  progress: 75,
                },
                {
                  id: "#2846",
                  type: "Green Tea",
                  quantity: "320 kg",
                  status: "Quality Check",
                  started: "4 hours ago",
                  progress: 90,
                },
                {
                  id: "#2845",
                  type: "White Tea",
                  quantity: "180 kg",
                  status: "Drying",
                  started: "6 hours ago",
                  progress: 60,
                },
                {
                  id: "#2844",
                  type: "Oolong Tea",
                  quantity: "280 kg",
                  status: "Completed",
                  started: "1 day ago",
                  progress: 100,
                },
                {
                  id: "#2843",
                  type: "Black Tea",
                  quantity: "520 kg",
                  status: "Packaging",
                  started: "1 day ago",
                  progress: 95,
                },
              ].map((batch, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-gray-900">{batch.id}</td>
                  <td className="p-4 text-gray-600">{batch.type}</td>
                  <td className="p-4 text-gray-600">{batch.quantity}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        batch.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : batch.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : batch.status === "Quality Check"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
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
                      <span className="text-sm text-gray-600">
                        {batch.progress}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Production;
