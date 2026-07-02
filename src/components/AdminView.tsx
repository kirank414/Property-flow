import React, { useState } from 'react';
import { 
  Users, 
  Building, 
  Calendar, 
  Trash2, 
  Edit2, 
  Plus, 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  FileText,
  Activity
} from 'lucide-react';
import { User, Property, BookingSlot, MaintenanceRequest } from '../types.ts';
import { 
  useUsers, 
  useCreateUser, 
  useUpdateUser, 
  useDeleteUser,
  useProperties,
  useCreateProperty,
  useUpdateProperty,
  useDeleteProperty,
  useAmenities,
  useCreateAmenity,
  useUpdateAmenity,
  useDeleteAmenity,
  useAuditLogs
} from '../api/hooks';
import { resizeAndCompressImage } from '../utils/image';

interface AdminViewProps {
  currentUser: User;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  maintenance: MaintenanceRequest[];
  setMaintenance: React.Dispatch<React.SetStateAction<MaintenanceRequest[]>>;
  bookings: BookingSlot[];
  setBookings: React.Dispatch<React.SetStateAction<BookingSlot[]>>;
  amenities: string[];
  setAmenities: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function AdminView({
  currentUser,
  users: propUsers,
  setUsers: propSetUsers,
  properties: propProperties,
  setProperties: propSetProperties,
  maintenance,
  setMaintenance,
  bookings,
  setBookings,
  amenities: propAmenities,
  setAmenities: propSetAmenities
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'properties' | 'amenities' | 'logs'>('users');

  // Queries
  const { data: propertiesData } = useProperties();
  const { data: amenitiesData } = useAmenities();
  const { data: logsData } = useAuditLogs();

  // Mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const deletePropertyMutation = useDeleteProperty();

  const createAmenityMutation = useCreateAmenity();
  const updateAmenityMutation = useUpdateAmenity();
  const deleteAmenityMutation = useDeleteAmenity();

  // Mapped Lists for UI
  const users = propUsers;
  const properties = propProperties;
  const amenities = propAmenities;
  const logsList = logsData?.logs || [];

  // Modal States
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<'Admin' | 'Manager' | 'Staff' | 'Tenant'>('Tenant');
  const [userPropId, setUserPropId] = useState('');

  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propName, setPropName] = useState('');
  const [propAddress, setPropAddress] = useState('');
  const [propType, setPropType] = useState('Residential');
  const [propUnits, setPropUnits] = useState(60);
  const [propOccupancy, setPropOccupancy] = useState(90);
  const [propImage, setPropImage] = useState('');

  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<string | null>(null);
  const [newAmenityName, setNewAmenityName] = useState('');

  // User CRUD handlers
  const openUserAdd = () => {
    setEditingUser(null);
    setUserName('');
    setUserEmail('');
    setUserRole('Tenant');
    setUserPropId(properties[0]?.id || '');
    setShowUserModal(true);
  };

  const openUserEdit = (user: User) => {
    setEditingUser(user);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
    setUserPropId(user.propertyId || '');
    setShowUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    const nameParts = userName.trim().split(' ');
    const firstName = nameParts[0] || 'First';
    const lastName = nameParts.slice(1).join(' ') || 'Last';
    const roleMap: Record<string, string> = {
      Admin: 'ADMIN',
      Manager: 'MANAGER',
      Staff: 'STAFF',
      Tenant: 'TENANT',
    };
    const mappedRole = roleMap[userRole] || 'TENANT';

    if (editingUser) {
      updateUserMutation.mutate({
        id: editingUser.id,
        data: {
          firstName,
          lastName,
          email: userEmail,
          role: mappedRole,
          propertyId: mappedRole === 'TENANT' ? userPropId || null : null,
        }
      });
    } else {
      createUserMutation.mutate({
        firstName,
        lastName,
        email: userEmail,
        password: 'password123',
        phone: '+15550199',
        role: mappedRole,
        propertyId: mappedRole === 'TENANT' ? userPropId || null : null,
      });
    }
    setShowUserModal(false);
  };

  const handleDeleteUser = (id: string, name: string) => {
    deleteUserMutation.mutate(id);
  };

  // Property CRUD handlers
  const openPropertyAdd = () => {
    setEditingProperty(null);
    setPropName('');
    setPropAddress('');
    setPropType('Residential');
    setPropUnits(60);
    setPropOccupancy(90);
    setPropImage('');
    setShowPropertyModal(true);
  };

  const openPropertyEdit = (prop: Property) => {
    setEditingProperty(prop);
    setPropName(prop.name);
    setPropAddress(prop.address);
    setPropType(prop.type);
    setPropUnits(prop.units);
    setPropOccupancy(prop.occupancy);
    setPropImage(prop.image || '');
    setShowPropertyModal(true);
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propName.trim() || !propAddress.trim()) return;

    if (editingProperty) {
      updatePropertyMutation.mutate({
        id: editingProperty.id,
        data: {
          name: propName,
          address: propAddress,
          type: propType,
          units: Number(propUnits),
          occupancyRate: Number(propOccupancy),
          imageUrl: propImage || null,
        }
      }, {
        onSuccess: () => {
          setShowPropertyModal(false);
          setPropImage('');
        },
        onError: (err: any) => {
          alert(err.response?.data?.message || err.message || 'Failed to update property details.');
        }
      });
    } else {
      const managerUser = users.find(u => u.role === 'Manager') || currentUser;
      createPropertyMutation.mutate({
        name: propName,
        address: propAddress,
        type: propType,
        units: Number(propUnits),
        occupancyRate: Number(propOccupancy),
        ownerId: managerUser.id,
        status: 'ACTIVE',
        imageUrl: propImage || null,
      }, {
        onSuccess: () => {
          setShowPropertyModal(false);
          setPropImage('');
        },
        onError: (err: any) => {
          alert(err.response?.data?.message || err.message || 'Failed to create property.');
        }
      });
    }
  };

  const handleDeleteProperty = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deletePropertyMutation.mutate(id, {
        onSuccess: () => {
          alert(`Property "${name}" deleted successfully.`);
        },
        onError: (err: any) => {
          alert(err.response?.data?.message || err.message || 'Failed to delete property.');
        }
      });
    }
  };

  // Amenity CRUD handlers
  const openAmenityAdd = () => {
    setEditingAmenity(null);
    setNewAmenityName('');
    setShowAmenityModal(true);
  };

  const handleSaveAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmenityName.trim()) return;

    if (editingAmenity) {
      const realAmenity = (amenitiesData?.amenities || []).find((am: any) => am.name === editingAmenity);
      if (realAmenity) {
        updateAmenityMutation.mutate({
          id: realAmenity.id,
          data: {
            name: newAmenityName,
          }
        });
      }
    } else {
      createAmenityMutation.mutate({
        propertyId: propertiesData?.properties?.[0]?.id || 'prop-1111-1111-1111-111111111111',
        name: newAmenityName,
        capacity: 20,
        rules: ['Follow posted hours'],
        operatingHours: '08:00 - 22:00',
        status: 'ACTIVE',
      });
    }
    setShowAmenityModal(false);
  };

  const handleDeleteAmenity = (name: string) => {
    const realAmenity = (amenitiesData?.amenities || []).find((am: any) => am.name === name);
    if (realAmenity) {
      deleteAmenityMutation.mutate(realAmenity.id);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* Header */}
      <div className="border-b border-brand-border pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-title tracking-tight font-sans">System Administration</h1>
          <p className="text-sm text-brand-body font-light mt-0.5">Manage users, properties, amenities, and monitor platform activities.</p>
        </div>
      </div>

      {/* Admin Tab Controls */}
      <div className="flex border-b border-brand-border gap-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 cursor-pointer leading-none min-h-[38px] ${activeTab === 'users' ? 'border-primary-teal text-primary-teal' : 'border-transparent text-brand-body'}`}
        >
          <Users className="w-4 h-4" />
          <span>Users</span>
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 cursor-pointer leading-none min-h-[38px] ${activeTab === 'properties' ? 'border-primary-teal text-primary-teal' : 'border-transparent text-brand-body'}`}
        >
          <Building className="w-4 h-4" />
          <span>Properties</span>
        </button>
        <button
          onClick={() => setActiveTab('amenities')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 cursor-pointer leading-none min-h-[38px] ${activeTab === 'amenities' ? 'border-primary-teal text-primary-teal' : 'border-transparent text-brand-body'}`}
        >
          <Calendar className="w-4 h-4" />
          <span>Amenities</span>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 cursor-pointer leading-none min-h-[38px] ${activeTab === 'logs' ? 'border-primary-teal text-primary-teal' : 'border-transparent text-brand-body'}`}
        >
          <FileText className="w-4 h-4" />
          <span>Activity Log</span>
        </button>
      </div>

      {/* --- TAB CONTENT AREA --- */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 sm:p-6 shadow-2xs">
        
        {/* 1. USER PROFILES MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* KPI Summary Row */}
            <div className="grid grid-cols-4 gap-4 mb-2">
              <div className="bg-brand-alternate rounded-xl p-3 border border-brand-border flex flex-col justify-center text-center">
                <span className="text-[10px] text-brand-muted uppercase font-bold">Total Users</span>
                <span className="text-lg font-extrabold text-brand-title">{users.length}</span>
              </div>
              <div className="bg-brand-alternate rounded-xl p-3 border border-brand-border flex flex-col justify-center text-center">
                <span className="text-[10px] text-brand-muted uppercase font-bold">System Admins</span>
                <span className="text-lg font-extrabold text-brand-title">{users.filter(u => u.role === 'Admin').length}</span>
              </div>
              <div className="bg-brand-alternate rounded-xl p-3 border border-brand-border flex flex-col justify-center text-center">
                <span className="text-[10px] text-brand-muted uppercase font-bold">Property Managers</span>
                <span className="text-lg font-extrabold text-brand-title">{users.filter(u => u.role === 'Manager').length}</span>
              </div>
              <div className="bg-brand-alternate rounded-xl p-3 border border-brand-border flex flex-col justify-center text-center">
                <span className="text-[10px] text-brand-muted uppercase font-bold">Tenants</span>
                <span className="text-lg font-extrabold text-brand-title">{users.filter(u => u.role === 'Tenant').length}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-brand-title">Active Platform Users</h3>
              <button
                onClick={openUserAdd}
                className="bg-primary-teal hover:bg-primary-teal-hover text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1 cursor-pointer min-h-[36px]"
              >
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-brand-alternate border-b border-brand-border text-brand-muted uppercase text-[9px] font-mono font-bold">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Assigned Property</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-brand-body">
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="p-3 font-semibold text-brand-title">{u.name}</td>
                      <td className="p-3 font-mono">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider ${
                          u.role === 'Admin' ? 'bg-slate-900 text-white dark:bg-slate-800' :
                          u.role === 'Manager' ? 'bg-primary-teal/15 text-primary-teal' :
                          u.role === 'Staff' ? 'bg-amber-500/10 text-amber-500' : 'bg-brand-alternate text-brand-body'
                        }`}>
                          {u.role === 'Admin' ? 'SYSTEM ADMIN' : 
                           u.role === 'Manager' ? 'PROPERTY MANAGER' : 
                           u.role === 'Staff' ? 'SUPPORT STAFF' : 'TENANT'}
                        </span>
                      </td>
                      <td className="p-3 text-brand-muted">
                        {u.propertyId ? properties.find(p => p.id === u.propertyId)?.name || '-' : '-'}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button onClick={() => openUserEdit(u)} className="p-1 hover:text-primary-teal" title="Edit user profile"><Edit2 className="w-4 h-4 inline" /></button>
                        {u.id !== currentUser.id && (
                          <button onClick={() => handleDeleteUser(u.id, u.name)} className="p-1 hover:text-rose-500" title="Delete user profile"><Trash2 className="w-4 h-4 inline" /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. PROPERTY COMPLEXES MANAGEMENT */}
        {activeTab === 'properties' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-brand-title">Property Complex Holdings</h3>
              <button
                onClick={openPropertyAdd}
                className="bg-primary-teal hover:bg-primary-teal-hover text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1 cursor-pointer min-h-[36px]"
              >
                <Plus className="w-4 h-4" />
                <span>Settle Property</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-brand-alternate border-b border-brand-border text-brand-muted uppercase text-[9px] font-mono font-bold">
                    <th className="p-3">Estate Name</th>
                    <th className="p-3">Location Address</th>
                    <th className="p-3">Asset Type</th>
                    <th className="p-3">Units count</th>
                    <th className="p-3">Occupancy</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-brand-body">
                  {properties.map(p => (
                    <tr key={p.id}>
                      <td className="p-3 font-semibold text-brand-title">{p.name}</td>
                      <td className="p-3 text-brand-muted">{p.address}</td>
                      <td className="p-3 font-mono">{p.type}</td>
                      <td className="p-3 font-mono">{p.units} units</td>
                      <td className="p-3 font-mono font-semibold text-emerald-600">{p.occupancy}%</td>
                      <td className="p-3 text-right space-x-2">
                        <button onClick={() => openPropertyEdit(p)} className="p-1 hover:text-primary-teal" title="Edit property details"><Edit2 className="w-4 h-4 inline" /></button>
                        <button onClick={() => handleDeleteProperty(p.id, p.name)} className="p-1 hover:text-rose-500" title="Delete property complex"><Trash2 className="w-4 h-4 inline" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. FACILITY AMENITY MANAGEMENT */}
        {activeTab === 'amenities' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-brand-title">Facility Amenities Ledger</h3>
              <button
                onClick={openAmenityAdd}
                className="bg-primary-teal hover:bg-primary-teal-hover text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1 cursor-pointer min-h-[36px]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Amenity</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-brand-alternate border-b border-brand-border text-brand-muted uppercase text-[9px] font-mono font-bold">
                    <th className="p-3">Facility Amenity Name</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-brand-body">
                  {amenities.map(am => (
                    <tr key={am}>
                      <td className="p-3 font-semibold text-brand-title">{am}</td>
                      <td className="p-3 text-right space-x-2">
                        <button onClick={() => { setEditingAmenity(am); setNewAmenityName(am); setShowAmenityModal(true); }} className="p-1 hover:text-primary-teal" title="Rename amenity"><Edit2 className="w-4 h-4 inline" /></button>
                        <button onClick={() => handleDeleteAmenity(am)} className="p-1 hover:text-rose-500" title="Delete amenity"><Trash2 className="w-4 h-4 inline" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. ACTIVITY LOG */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-brand-border pb-2">
              <h3 className="text-sm font-extrabold text-brand-title flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-primary-teal" />
                <span>Activity Log</span>
              </h3>
            </div>

            <div className="bg-[#0f172a] text-emerald-400 font-mono text-[11px] p-4 rounded-xl space-y-1.5 h-64 overflow-y-auto">
              {(() => {
                const allowedEvents = [
                  'USER CREATED', 'USER UPDATED', 'USER DELETED',
                  'PROPERTY ADDED', 'PROPERTY CREATED', 'PROPERTY UPDATED', 'AMENITY ADDED', 'AMENITY CREATED',
                  'MAINTENANCE STATUS UPDATED', 'BOOKING CREATED', 'BOOKING CANCELLED'
                ];
                const filteredLogs = logsList.filter((log: any) => {
                  const eventStr = `${log.entity} ${log.action}`.toUpperCase();
                  return allowedEvents.some(ae => eventStr.includes(ae) || (log.details && log.details.toUpperCase().includes(ae)));
                });
                return filteredLogs.length > 0 ? (
                  filteredLogs.map((log: any, idx: number) => {
                    const actionName = `${log.entity} ${log.action}`.toUpperCase();
                    return (
                      <div key={idx} className="select-text truncate">
                        [{log.createdAt ? log.createdAt.replace('T', ' ').substring(0, 19) : ''}] {actionName} - {log.details ? log.details : `ID: ${log.entityId?.substring(0, 8)}`} (by {log.userName || 'System'})
                      </div>
                    );
                  })
                ) : (
                  <div className="text-slate-500 text-center py-20 font-sans">No platform events logged.</div>
                );
              })()}
            </div>
          </div>
        )}

      </div>

      {/* --- CRUD MODALS --- */}
      
      {/* User Add/Edit Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-brand-surface border border-brand-border rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-border pb-2">
              <h4 className="text-sm font-extrabold text-brand-title">{editingUser ? 'Edit User Credentials' : 'Add User Profile'}</h4>
              <button onClick={() => setShowUserModal(false)}><X className="w-5 h-5 text-brand-muted" /></button>
            </div>
            
            <form onSubmit={handleSaveUser} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-body uppercase block">Profile Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 bg-brand-alternate border border-brand-border rounded-xl text-brand-title focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-body uppercase block">Security Email</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="name@propertyflow.com"
                  className="w-full px-3 py-2 bg-brand-alternate border border-brand-border rounded-xl text-brand-title focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-body uppercase block">Clearance Role</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-brand-alternate border border-brand-border rounded-xl text-brand-body focus:outline-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Staff">Staff</option>
                    <option value="Tenant">Tenant</option>
                  </select>
                </div>

                {userRole === 'Tenant' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-brand-body uppercase block">Assign Complex</label>
                    <select
                      value={userPropId}
                      onChange={(e) => setUserPropId(e.target.value)}
                      className="w-full px-3 py-2 bg-brand-alternate border border-brand-border rounded-xl text-brand-body focus:outline-none"
                    >
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-brand-border">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-3 py-2 bg-brand-alternate rounded-xl font-semibold">Discard</button>
                <button type="submit" className="px-4 py-2 bg-primary-teal text-white rounded-xl font-semibold">Save User Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Property Add/Edit Modal */}
      {showPropertyModal && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-brand-surface border border-brand-border rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-border pb-2">
              <h4 className="text-sm font-extrabold text-brand-title">{editingProperty ? 'Edit Property Details' : 'Settle Property'}</h4>
              <button onClick={() => setShowPropertyModal(false)}><X className="w-5 h-5 text-brand-muted" /></button>
            </div>
            
            <form onSubmit={handleSaveProperty} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-body uppercase block">Property Name</label>
                <input
                  type="text"
                  value={propName}
                  onChange={(e) => setPropName(e.target.value)}
                  placeholder="e.g. Sunset Tower Complex"
                  className="w-full px-3 py-2 bg-brand-alternate border border-brand-border rounded-xl text-brand-title focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-body uppercase block">Address location</label>
                <input
                  type="text"
                  value={propAddress}
                  onChange={(e) => setPropAddress(e.target.value)}
                  placeholder="Street address physical"
                  className="w-full px-3 py-2 bg-brand-alternate border border-brand-border rounded-xl text-brand-title focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-body uppercase block">Asset Type</label>
                  <select
                    value={propType}
                    onChange={(e) => setPropType(e.target.value)}
                    className="w-full px-2 py-2 bg-brand-alternate border border-brand-border rounded-xl text-brand-body focus:outline-none"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-body uppercase block">Total Units</label>
                  <input
                    type="number"
                    value={propUnits}
                    onChange={(e) => setPropUnits(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-brand-alternate border border-brand-border rounded-xl text-brand-title focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-body uppercase block">Occupancy %</label>
                  <input
                    type="number"
                    value={propOccupancy}
                    onChange={(e) => setPropOccupancy(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-brand-alternate border border-brand-border rounded-xl text-brand-title focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-body uppercase block">Property Photo</label>
                <div className="flex items-center space-x-3 p-2 bg-brand-alternate border border-brand-border rounded-xl">
                  {propImage ? (
                    <img 
                      src={propImage} 
                      alt="Property Preview" 
                      className="w-12 h-12 rounded-lg object-cover border border-brand-border" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg border border-dashed border-brand-border bg-brand-alternate/50 flex items-center justify-center text-brand-muted text-[10px] select-none text-center">
                      No Photo
                    </div>
                  )}
                  <div className="flex flex-col space-y-1">
                    <button
                      type="button"
                      onClick={() => document.getElementById('admin-prop-file-input')?.click()}
                      className="px-2.5 py-1.5 bg-brand-surface hover:bg-brand-alternate text-brand-title border border-brand-border rounded-lg text-[10px] font-semibold cursor-pointer focus:outline-none transition-colors"
                    >
                      Choose Local File
                    </button>
                    {propImage && (
                      <button
                        type="button"
                        onClick={() => setPropImage('')}
                        className="text-[9px] text-left text-rose-500 hover:text-rose-600 font-semibold underline cursor-pointer focus:outline-none bg-transparent border-0 p-0"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  id="admin-prop-file-input"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const base64String = await resizeAndCompressImage(file);
                        setPropImage(base64String);
                      } catch (err: any) {
                        alert(err.message || 'Failed to process property photo.');
                      }
                    }
                  }}
                  className="hidden"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-brand-border">
                <button type="button" onClick={() => setShowPropertyModal(false)} className="px-3 py-2 bg-brand-alternate rounded-xl font-semibold">Discard</button>
                <button
                  type="submit"
                  disabled={createPropertyMutation.isPending || updatePropertyMutation.isPending}
                  className="px-4 py-2 bg-primary-teal text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createPropertyMutation.isPending || updatePropertyMutation.isPending
                    ? 'Saving...'
                    : 'Save Property Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Amenity Add/Edit Modal */}
      {showAmenityModal && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-brand-surface border border-brand-border rounded-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-brand-border pb-2">
              <h4 className="text-sm font-extrabold text-brand-title">{editingAmenity ? 'Rename Facility Amenity' : 'Add Facility Amenity'}</h4>
              <button onClick={() => setShowAmenityModal(false)}><X className="w-5 h-5 text-brand-muted" /></button>
            </div>
            
            <form onSubmit={handleSaveAmenity} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-brand-body uppercase block">Amenity Name</label>
                <input
                  type="text"
                  value={newAmenityName}
                  onChange={(e) => setNewAmenityName(e.target.value)}
                  placeholder="e.g. Conference Room"
                  className="w-full px-3 py-2 bg-brand-alternate border border-brand-border rounded-xl text-brand-title focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-brand-border">
                <button type="button" onClick={() => setShowAmenityModal(false)} className="px-3 py-2 bg-brand-alternate rounded-xl font-semibold">Discard</button>
                <button type="submit" className="px-4 py-2 bg-primary-teal text-white rounded-xl font-semibold">Save Amenity</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
