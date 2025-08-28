import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  AlertCircle,
  Calendar,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Eye,
  Mail,
  Phone,
  MapPin,
  Award,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Home,
  UserPlus,
  Building,
  Star,
  Save,
  AlertTriangle
} from "lucide-react";
import { addTeamMember, deleteTeamMember, getTeam, getTeamMembersInfo, updateTeam, workersWithoutTeams } from '../../services/teamSlice';
import { ToastContainer, toast } from 'react-toastify';
import { PropagateLoader } from "react-spinners";

function ViewTeam() {

  const {id} = useParams();
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [emptyTeamMembers,setEmptyTeamMembers] = useState([]);
  const [editTeamData, setEditTeamData] = useState({
    name: '',
    description: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUserSearchDialog, setShowUserSearchDialog] = useState(false);
  const [dialogSearchQuery, setDialogSearchQuery] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
  // Toast notification function
  const showToast = (message, type = 'success') => {
    console.log(`${type}: ${message}`);
    // Replace with your preferred toast implementation
  };
  
  // Mock team data - replace with actual API call
  const [teamData, setTeamData] = useState({
    teamId: id,
    name: "",
    description: "",
    department: "",
    createdAt: "",
  });

  const [currentMembers] = useState([]);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getStatusBadge = (isDeleted) => {
    if (!isDeleted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          Inactive
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </span>
    );
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = emptyTeamMembers.filter(person => 
        person.firstName.toLowerCase().includes(query.toLowerCase()) ||
        person.lastName.toLowerCase().includes(query.toLowerCase()) ||
        person.personCode.toLowerCase().includes(query.toLowerCase()) ||
        person.email.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  const handleOpenUserDialog = async () => {
    setShowUserSearchDialog(true);
    setIsLoadingUsers(true);
    // Simulate API call to fetch all users
    setTimeout(() => {
      setSearchResults(emptyTeamMembers);
      setIsLoadingUsers(false);
    }, 800);
  };

  const getFilteredUsers = () => {
    if (!dialogSearchQuery.trim()) {
      return searchResults;
    }
    return searchResults.filter(person => 
      person.firstName.toLowerCase().includes(dialogSearchQuery.toLowerCase()) ||
      person.lastName.toLowerCase().includes(dialogSearchQuery.toLowerCase()) ||
      person.personCode.toLowerCase().includes(dialogSearchQuery.toLowerCase()) ||
      person.email.toLowerCase().includes(dialogSearchQuery.toLowerCase()) ||
      person.role.userRole.toLowerCase().includes(dialogSearchQuery.toLowerCase())
    );
  };

  const addPersonToTeam = async(person) => {
    // Check if person is already in team
    const isAlreadyMember = currentMembers.some(member => member.personId === person.personId);
    const isAlreadyAdded = teamMembers.some(member => member.personId === person.personId);
    
    if (isAlreadyMember || isAlreadyAdded) {
      showToast("Person is already a team member", "error");
      return;
    }
    const joinedDate = new Date().toISOString().split('T')[0];
    const teamMemberPayload = {teamId:teamData.teamId,personId:person.personId,joinedDate:joinedDate}
    const addTeamMemberResponse = await addTeamMember(teamMemberPayload);
    toast.success("New Team Member added sucessfully!", {
            position: 'top-center',
          });
    const newMember = {
      ...person,
      joinedTeam: new Date().toISOString().split('T')[0]
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const removeFromTeam = async(personId) => {
    setTeamMembers(prev => prev.filter(member => member.personId !== personId));
    const deletePayload = {teamId:teamData.teamId,personId};
    try {
      const deleteTeamMemberResponse = await deleteTeamMember(deletePayload);
      if(deleteTeamMemberResponse.data.success){
        toast.success("Team Member deleted sucessfully!", {
              position: 'top-center',
            });
      }
    } catch (error) {
      toast.error("Failed to delete team member!", {
              position: 'top-center',
            });
    }   
  };

  const handleEditTeam = () => {
    setEditTeamData({
      name: teamData.name,
      description: teamData.description
    });
    setIsEditingTeam(true);
  };

  const handleSaveTeamChanges = async() => {
    // API call to update team data would go here
    setTeamData(prev => ({
      ...prev,
      name: editTeamData.name,
      description: editTeamData.description
    }));
    try {
      const description = editTeamData.description;
      const updateTeamResponse = await updateTeam(id,description);
      if(updateTeamResponse.data.success){
        setIsEditingTeam(false);
        toast.success("Team updated successfully!", {
              position: 'top-center',
            });
      }
    } catch (error) {
      toast.error("Team updated failed!", {
            position: 'top-center',
          });
    }
    
  };

  const handleCancelEdit = () => {
    setIsEditingTeam(false);
    setEditTeamData({ name: '', description: '' });
  };

  const handleDeleteTeam = () => {
    // API call to delete team would go here
    showToast("Team deleted successfully");
    // Redirect to teams list page
    console.log("Redirecting to teams list...");
  };

  const allMembers = [...currentMembers, ...teamMembers];

  const isPersonInTeam = (personId) => {
    return allMembers.some(member => member.personId === personId);
  };

  const getPersonsWithNoTeams = async()=>{
    const personNotInTeamsResponse = await workersWithoutTeams();
    setEmptyTeamMembers(personNotInTeamsResponse.data.data);
  }
  const getTeamInfo = async()=>{
    const teamResponse = await getTeam(id);
    //console.log(teamResponse.data)
   if (teamResponse.data.success) {
      setTeamData({
        teamId: teamResponse.data.data.teamId,
        name: teamResponse.data.data.name || "",
        description: teamResponse.data.data.description || "",
        createdAt: teamResponse.data.data.createdAt || "",
      });
    }
  }

  const getTeamMembers = async()=>{
    try {
      const teamMembersResonse = await getTeamMembersInfo(id);
      if(teamMembersResonse.data.success){
        setTeamMembers(teamMembersResonse.data.data);
      }
    } catch (error) {
      
    }
   
  }

  useEffect(() => {
    getPersonsWithNoTeams();
    getTeamInfo();
    getTeamMembers();
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);   

    return () => clearTimeout(debounceTimer);
  }, []);

  return (
    <>
      {loadingWorkers ? (
        <div className="w-auto h-2/3 flex items-center justify-center">
                  <PropagateLoader
                      color="#48bb78"
                      loading={loadingWorkers}
                      cssOverride={{
                        display: "block",
                        margin: "0 auto",
                        borderColor: "#48bb78",
                      }}
                      size={20}
                    />
        </div>
      ) : (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
          <ToastContainer autoClose={2000} />
          {/* Custom notification area */}
          <div id="toast-container" className="fixed top-4 right-4 z-50"></div>

          {/* Team Information Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{teamData.name}</h1>
                    <p className="text-green-100 mt-1 flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {teamData.department} • {allMembers.length} Members
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleEditTeam}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2 inline" />
                    Edit Team
                  </button>
                  <button className="px-4 py-2 bg-white text-green-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                    <Download className="h-4 w-4 mr-2 inline" />
                    Export
                  </button>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-6">
              {isEditingTeam ? (
                /* Edit Form */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Team Information</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        <X className="h-4 w-4 mr-2 inline" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveTeamChanges}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                      >
                        <Save className="h-4 w-4 mr-2 inline" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Team Name
                        </label>
                        <input
                          type="text"
                          value={editTeamData.name}
                          onChange={(e) => setEditTeamData(prev => ({ ...prev, name: e.target.value }))}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter team name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Team Description
                        </label>
                        <textarea
                          value={editTeamData.description}
                          onChange={(e) => setEditTeamData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                          placeholder="Enter team description"
                        />
                      </div>
                    </div>
                    
                    <div className="lg:flex lg:items-end lg:justify-end">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-red-900 mb-1">Danger Zone</h4>
                            <p className="text-sm text-red-700 mb-3">
                              Deleting this team will permanently remove all team data and member associations. This action cannot be undone.
                            </p>
                            <button
                              onClick={() => setShowDeleteConfirm(true)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                            >
                              <Trash2 className="h-4 w-4 mr-2 inline" />
                              Delete Team
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Display Mode */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Description</h3>
                    <p className="text-gray-600 leading-relaxed">{teamData.description}</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <p className="text-gray-900">{new Date(teamData.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-opacity-10 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 border-gray-300">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Delete Team</h3>
                      <p className="text-sm text-gray-600">This action cannot be undone</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-700 mb-3">
                      Are you sure you want to delete <strong>"{teamData.name}"</strong>?
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• All team data will be permanently deleted</li>
                        <li>• {allMembers.length} team members will be unassigned</li>
                        <li>• Team history and records will be lost</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteTeam();
                        setShowDeleteConfirm(false);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                    >
                      <Trash2 className="h-4 w-4 mr-2 inline" />
                      Delete Team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add New Member Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-green-600" />
                Add Team Member
              </h2>
              <p className="text-gray-600 mt-1">Search and add new members to your team</p>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Click 'Search Users' to find and add team members..."
                      readOnly
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-pointer text-lg"
                      onClick={handleOpenUserDialog}
                    />
                  </div>
                </div>
                <button
                  onClick={handleOpenUserDialog}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Users
                </button>
              </div>
            </div>
          </div>

          {/* User Search Dialog */}
          {showUserSearchDialog && (
            <div className="fixed inset-0 bg-opacity-10 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col border-2 border-gray-300">
                {/* Dialog Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white rounded-t-2xl">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Add Team Members</h3>
                    <p className="text-gray-600 mt-1">Select employees to add to your team</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserSearchDialog(false);
                      setDialogSearchQuery('');
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, employee ID, role, or department..."
                      value={dialogSearchQuery}
                      onChange={(e) => setDialogSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                    />
                  </div>
                </div>

                {/* Users List */}
                <div className="flex-1 overflow-y-auto">
                  {isLoadingUsers ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      <span className="ml-3 text-gray-600">Loading employees...</span>
                    </div>
                  ) : (
                    <div className="p-6">
                      {getFilteredUsers().length > 0 ? (
                        <div className="space-y-3">
                          <div className="text-sm text-gray-600 mb-4">
                            Showing {getFilteredUsers().length} employee{getFilteredUsers().length !== 1 ? 's' : ''}
                          </div>
                          {getFilteredUsers().map((person) => (
                            <div 
                              key={person.personId} 
                              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                                  {getInitials(person.firstName, person.lastName)}
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 text-lg">
                                    {person.firstName} {person.lastName}
                                  </div>
                                  <div className="text-sm text-gray-600 flex items-center space-x-4 mt-1">
                                    <span className="flex items-center">
                                      <Award className="h-3 w-3 mr-1" />
                                      {person.role.userRole}
                                    </span>
                                    <span className="flex items-center">
                                      <Building className="h-3 w-3 mr-1" />
                                      {person.department}
                                    </span>
                                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                      {person.personCode}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center space-x-4 mt-1">
                                    <span className="flex items-center">
                                      <Mail className="h-3 w-3 mr-1" />
                                      {person.email}
                                    </span>
                                    <span className="flex items-center">
                                      <Phone className="h-3 w-3 mr-1" />
                                      {person.phone}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {isPersonInTeam(person.personId) ? (
                                  <span className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Already in Team
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => addPersonToTeam(person)}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add to Team
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                          <h4 className="text-lg font-medium text-gray-900 mb-2">No employees found</h4>
                          <p className="text-gray-600">
                            {dialogSearchQuery 
                              ? `No employees match "${dialogSearchQuery}"`
                              : "No employees available to add"
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Dialog Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {allMembers.length} team member{allMembers.length !== 1 ? 's' : ''} currently
                    </div>
                    <button
                      onClick={() => {
                        setShowUserSearchDialog(false);
                        setDialogSearchQuery('');
                      }}
                      className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Members Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                  <p className="text-gray-600 mt-1">{allMembers.length} active members</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Export List
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-700">Member</th>
                    <th className="text-left p-4 font-semibold text-gray-700">ID</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Contact</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Joined</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allMembers.map((member) => (
                    <tr key={member.personId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {getInitials(member.firstName, member.lastName)}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="text-sm text-gray-600">{member.nicNumber}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {member.personCode}
                        </span>
                      </td>
                      
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">{member.role.userRole}</div>
                          <div className="text-sm text-gray-600">{member.department}</div>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {member.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-1" />
                            {member.email}
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        {getStatusBadge(member.isDeleted)}
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(member.joinedDate).toLocaleDateString()}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => removeFromTeam(member.personId)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {allMembers.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
                  <p>Start building your team by searching and adding members above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewTeam;