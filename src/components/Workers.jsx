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
import WorkerDataEntryForm from "./WorkerDataEntryForm";
import { useState } from "react";

const Workers = () => {

  const[workerView,setWorkerView] = useState(true)

  return (
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
            <h3 className="text-lg font-semibold text-gray-800">
              Worker Management
            </h3>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Mark Attendance
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" onClick={()=>setWorkerView(!workerView)}>
                {workerView === true? "Add Worker" : "View Workers"}
              </button>
            </div>
          </div>
        </div>
        {
          workerView === true?
          (
             <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-600">
                  Worker ID
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Name
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Department
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Shift
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Performance
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "W001",
                  name: "Kumara Silva",
                  dept: "Plucking",
                  shift: "Morning",
                  status: "Present",
                  performance: 92,
                  contact: "+94 77 123 4567",
                },
                {
                  id: "W002",
                  name: "Nimal Perera",
                  dept: "Processing",
                  shift: "Day",
                  status: "Present",
                  performance: 88,
                  contact: "+94 71 234 5678",
                },
                {
                  id: "W003",
                  name: "Kamala Fernando",
                  dept: "Packaging",
                  shift: "Evening",
                  status: "On Leave",
                  performance: 95,
                  contact: "+94 76 345 6789",
                },
                {
                  id: "W004",
                  name: "Sunil Jayasinghe",
                  dept: "Quality Control",
                  shift: "Morning",
                  status: "Present",
                  performance: 89,
                  contact: "+94 78 456 7890",
                },
                {
                  id: "W005",
                  name: "Priya Mendis",
                  dept: "Plucking",
                  shift: "Morning",
                  status: "Absent",
                  performance: 76,
                  contact: "+94 77 567 8901",
                },
                {
                  id: "W006",
                  name: "Ravi Gunasekara",
                  dept: "Processing",
                  shift: "Day",
                  status: "Present",
                  performance: 91,
                  contact: "+94 75 678 9012",
                },
              ].map((worker, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-gray-900">{worker.id}</td>
                  <td className="p-4 text-gray-900">{worker.name}</td>
                  <td className="p-4 text-gray-600">{worker.dept}</td>
                  <td className="p-4 text-gray-600">{worker.shift}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        worker.status === "Present"
                          ? "bg-green-100 text-green-800"
                          : worker.status === "On Leave"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {worker.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            worker.performance >= 90
                              ? "bg-green-600"
                              : worker.performance >= 80
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${worker.performance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {worker.performance}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {worker.contact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          ) :
          (<WorkerDataEntryForm/>)
        }
        {/* <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-600">
                  Worker ID
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Name
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Department
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Shift
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Performance
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "W001",
                  name: "Kumara Silva",
                  dept: "Plucking",
                  shift: "Morning",
                  status: "Present",
                  performance: 92,
                  contact: "+94 77 123 4567",
                },
                {
                  id: "W002",
                  name: "Nimal Perera",
                  dept: "Processing",
                  shift: "Day",
                  status: "Present",
                  performance: 88,
                  contact: "+94 71 234 5678",
                },
                {
                  id: "W003",
                  name: "Kamala Fernando",
                  dept: "Packaging",
                  shift: "Evening",
                  status: "On Leave",
                  performance: 95,
                  contact: "+94 76 345 6789",
                },
                {
                  id: "W004",
                  name: "Sunil Jayasinghe",
                  dept: "Quality Control",
                  shift: "Morning",
                  status: "Present",
                  performance: 89,
                  contact: "+94 78 456 7890",
                },
                {
                  id: "W005",
                  name: "Priya Mendis",
                  dept: "Plucking",
                  shift: "Morning",
                  status: "Absent",
                  performance: 76,
                  contact: "+94 77 567 8901",
                },
                {
                  id: "W006",
                  name: "Ravi Gunasekara",
                  dept: "Processing",
                  shift: "Day",
                  status: "Present",
                  performance: 91,
                  contact: "+94 75 678 9012",
                },
              ].map((worker, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-gray-900">{worker.id}</td>
                  <td className="p-4 text-gray-900">{worker.name}</td>
                  <td className="p-4 text-gray-600">{worker.dept}</td>
                  <td className="p-4 text-gray-600">{worker.shift}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        worker.status === "Present"
                          ? "bg-green-100 text-green-800"
                          : worker.status === "On Leave"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {worker.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            worker.performance >= 90
                              ? "bg-green-600"
                              : worker.performance >= 80
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${worker.performance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {worker.performance}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {worker.contact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
        {/* <WorkerDataEntryForm/> */}
      </div>
    </div>
  );
};

export default Workers;
