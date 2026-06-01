import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Camera, MapPin, Lock, Phone, User as UserIcon, Shield, Edit2 } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { api } from '../lib/api';
import { toast } from 'react-hot-toast';
import { Country, City } from 'country-state-city';

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=150&q=80";

export const ProfileScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: 'male',
    targetGender: 'female',
    agePreference: '',
    country: '',
    city: '',
    photoUrl: '',
  });

  const [securityData, setSecurityData] = useState({
    login: 'qwert@qwert',
    currentPassword: '',
    newPassword: '',
    phone: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        const data = res.data;
        if (data) {
          setProfileData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            age: data.age?.toString() || '',
            gender: data.gender || 'male',
            targetGender: data.targetGender || 'female',
            agePreference: data.agePreference || '',
            country: data.country || '',
            city: data.city || '',
            photoUrl: data.photoUrl || ''
          });
          setSecurityData(prev => ({ ...prev, email: data.email || '', phone: data.phone || '' }));
        }
      } catch (err) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

 const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving...');
    try {
      await api.put('/user/profile', profileData);
      toast.dismiss(loadingToast);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error('Failed to update profile.');
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving...');
    try {
      await api.put('/user/profile', profileData);
      toast.dismiss(loadingToast);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-[#0a0a0a]">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
        </div>
        <BottomNav />
      </div>
    );
  }

 return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] min-h-screen text-white overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="w-full max-w-2xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6 mt-4">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            {!isEditing && activeTab === 'profile' && (
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2 bg-gray-900 rounded-full text-rose-500 hover:bg-gray-800 transition-colors"
              >
                <Edit2 size={18} />
              </button>
            )}
          </div>
          
          <div className="flex bg-gray-900/80 p-1 rounded-2xl mb-8 border border-gray-800">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'profile' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <UserIcon size={16} />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'security' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Shield size={16} />
              Security
            </button>
          </div>

          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="relative group cursor-pointer"
                  onClick={() => isEditing && fileInputRef.current?.click()}
                  >
                  <div className="w-28 h-28 rounded-full border-2 border-gray-800 overflow-hidden shadow-lg shadow-black">
                    <img 
                      src={profileData.photoUrl || DEFAULT_AVATAR} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                      <Camera size={24} className="text-white" />
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                {!isEditing && profileData.firstName && (
                  <h2 className="text-xl font-bold mt-4">{profileData.firstName} {profileData.lastName}</h2>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-6">
                  <div className="bg-gray-900/40 rounded-2xl p-5 border border-gray-800/50 space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-800/50 pb-4">
                      <span className="text-sm text-gray-500">Age</span>
                      <span className="font-medium">{profileData.age || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-800/50 pb-4">
                      <span className="text-sm text-gray-500">Gender</span>
                      <span className="font-medium capitalize">{profileData.gender}</span>
                    </div>
                    <div className="flex justify-between items-center pb-1">
                      <span className="text-sm text-gray-500">Location</span>
                      <span className="font-medium flex items-center gap-1">
                        {(profileData.city || profileData.country) && <MapPin size={14} className="text-rose-500" />}
                        {profileData.city ? `${profileData.city}, ${profileData.country}` : profileData.country || 'Not set'}
                        </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1 mt-6 mb-3">Looking For</h3>
                  <div className="bg-gray-900/40 rounded-2xl p-5 border border-gray-800/50 space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-800/50 pb-4">
                      <span className="text-sm text-gray-500">Interested in</span>
                      <span className="font-medium capitalize">{profileData.targetGender}</span>
                    </div>
                    <div className="flex justify-between items-center pb-1">
                      <span className="text-sm text-gray-500">Age Range</span>
                      <span className="font-medium">{profileData.agePreference || 'Any'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-500 pl-1">First Name</label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-500 pl-1">Last Name</label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-500 pl-1">Age</label>
                      <input
                        type="number"
                        value={profileData.age}
                        onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-500 pl-1">I am a</label>
                      <select
                        value={profileData.gender}
                        onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 text-white appearance-none"
                      >
                        <option value="male">Man</option>
                        <option value="female">Woman</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-500 pl-1">Country</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MapPin size={16} className="text-rose-500" />
                        </div>
                        <select
                          value={profileData.country}
                          onChange={(e) => {
                            setProfileData({...profileData, country: e.target.value, city: ''})
                          }}
                          className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 text-white appearance-none cursor-pointer"
                        >
                          <option value="">Select Country</option>
                          {Country.getAllCountries().map((country) => (
                            <option key={country.isoCode} value={country.isoCode}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 pl-1">City</label>
                        <select
                        value={profileData.city}
                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        disabled={!profileData.country} 
                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 text-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Select City</option>
                        {profileData.country && City.getCitiesOfCountry(profileData.country)?.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      </div>

                  <div className="h-px w-full bg-gray-900 my-6"></div>
                  <h2 className="text-sm font-bold text-white mb-4">Looking For</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-500 pl-1">Gender</label>
                      <select
                        value={profileData.targetGender}
                        onChange={(e) => setProfileData({...profileData, targetGender: e.target.value})}
                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 text-white appearance-none"
                      >
                        <option value="female">Women</option>
                        <option value="male">Men</option>
                        <option value="everyone">Everyone</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-500 pl-1">Age Preference</label>
                      <input
                        type="text"
                        value={profileData.agePreference}
                        onChange={(e) => setProfileData({...profileData, agePreference: e.target.value})}
                        className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-4 rounded-2xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all border border-gray-800"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-all"
                    >
                      Save Updates
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSaveSecurity} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 pl-1">Login / Email</label>
                <input
                  type="email"
                  value={securityData.login}
                  onChange={(e) => setSecurityData({...securityData, login: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 focus:bg-gray-900 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 pl-1">Phone Number</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="tel"
                      value={securityData.phone}
                      onChange={(e) => setSecurityData({...securityData, phone: e.target.value})}
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 focus:bg-gray-900 transition-all"
                      placeholder="+380..."
                    />
                  </div>
                  <button type="button" className="px-4 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-xl border border-gray-700 transition-colors">
                    Verify
                  </button>
                </div>
              </div>

              <div className="h-px w-full bg-gray-900 my-6"></div>

              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Lock size={16} className="text-gray-400" />
                Change Password
              </h2>

              <div className="space-y-4">
                <input
                  type="password"
                  value={securityData.currentPassword}
                  onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 focus:bg-gray-900 transition-all"
                  placeholder="Current Password"
                />
                <input
                  type="password"
                  value={securityData.newPassword}
                  onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 focus:bg-gray-900 transition-all"
                  placeholder="New Password"
                />
              </div>

              <button type="submit" className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold hover:bg-gray-800 border border-gray-800 transition-all mt-6">
                Update Security Settings
              </button>
            </form>
          )}

          <div className="mt-12 pt-6 border-t border-gray-900">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-rose-500/10 text-rose-500 font-medium hover:bg-rose-500/20 transition-colors border border-rose-500/20"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
};