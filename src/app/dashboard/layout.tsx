'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getToken, logoutUser } from '@/lib/auth';
import { FiMenu, FiHome, FiUser, FiLogOut, FiEdit, FiMail, FiPhone, FiShield, FiSave, FiX } from 'react-icons/fi';

interface User {
  name: string;
  email: string;
  phone: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState<'home' | 'profile'>('home');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<User>({ name: '', email: '', phone: '' });

  useEffect(() => {
    const t = getToken();
    if (!t) {
      router.push('/login');
      return;
    }
    setToken(t);

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setEditForm(parsedUser);
    }
  }, [router]);

  if (!token) return null;

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditForm(user || { name: '', email: '', phone: '' });
    }
  };

  const handleSave = () => {
    setUser(editForm);
    localStorage.setItem('user', JSON.stringify(editForm));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(user || { name: '', email: '', phone: '' });
    setIsEditing(false);
  };

  const renderPage = () => {
    if (activePage === 'home') {
      // For home, render the children (DashboardHome) directly without extra card wrapper
      return <div className="w-full animate-fade-in">{children}</div>;
    } else {
      // Enhanced card for profile
      const cardClass =
        'relative w-full max-w-4xl p-8 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-black/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden';

      return (
        <div className={`${cardClass} animate-fade-in`}>
          {/* Subtle animated background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-green-500/10 opacity-50 animate-pulse"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 text-center">Profile</h2>
            
            {/* Profile Image with Enhanced Gradient Border and Glow */}
            <div className="relative mb-6 mx-auto w-fit">
              <div className="p-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-full animate-spin-slow">
                <img
                  src="/profile.png"
                  alt="Profile Photo"
                  className="w-32 h-32 rounded-full object-cover shadow-2xl border-4 border-white/20"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 blur-2xl animate-pulse"></div>
            </div>
            
            {/* User Name and Role */}
            <div className="text-center mb-6">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="text-3xl font-semibold text-white bg-gray-800/70 px-4 py-2 rounded-xl border border-gray-600/50 text-center mb-2"
                  placeholder="Name"
                />
              ) : (
                <h3 className="text-3xl font-semibold text-white mb-2">{user?.name}</h3>
              )}
              <div className="inline-flex items-center gap-2 bg-gray-800/70 px-4 py-2 rounded-xl border border-gray-600/50">
                <FiShield className="text-cyan-400" size={16} />
                <p className="text-gray-400 font-medium text-sm">Role</p>
                <p className="text-cyan-400 font-semibold">User</p>
              </div>
            </div>
            
            {/* Bio Section */}
            <div className="bg-gray-800/70 p-4 rounded-xl border border-gray-600/50 mb-6">
              <h4 className="text-lg font-semibold text-white mb-2">Bio</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Passionate about technology and innovation. Always exploring new ways to improve user experiences and build amazing applications.
              </p>
            </div>
            
            {/* Registered Info Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/70 p-4 rounded-xl border border-gray-600/50 text-center">
                <FiMail className="text-blue-400 mx-auto mb-2" size={24} />
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="text-2xl font-bold text-cyan-400 bg-transparent border-none outline-none text-center"
                    placeholder="Email"
                  />
                ) : (
                  <p className="text-2xl font-bold text-cyan-400">{user?.email}</p>
                )}
                <p className="text-gray-400 text-sm">Registered Email</p>
              </div>
              <div className="bg-gray-800/70 p-4 rounded-xl border border-gray-600/50 text-center">
                <FiPhone className="text-green-400 mx-auto mb-2" size={24} />
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="text-2xl font-bold text-cyan-400 bg-transparent border-none outline-none text-center"
                    placeholder="Phone"
                  />
                ) : (
                  <p className="text-2xl font-bold text-cyan-400">{user?.phone}</p>
                )}
                <p className="text-gray-400 text-sm">Registered Phone</p>
              </div>
            </div>
            
            {/* Edit/Save/Cancel Buttons */}
            <div className="text-center">
              {isEditing ? (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FiSave size={18} />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FiX size={18} />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FiEdit size={18} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      {/* Navbar */}
      <nav className="flex justify-between items-center mb-6 relative z-20">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-wide">
          {activePage === 'home' ? 'Dashboard' : 'Profile'}
        </h1>

        <div className="relative">
          <button
            className="p-3 rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 text-red-400 shadow-lg hover:from-gray-700 hover:to-gray-600 transition-all duration-300 hover:scale-105 border border-gray-600/50"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FiMenu size={24} />
          </button>

          <div
            className={`absolute right-0 mt-2 w-48 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 border border-gray-700/50 ${
              menuOpen ? 'max-h-96 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'
            }`}
          >
            <button
              className={`w-full text-left p-3 hover:bg-red-800/40 transition-all duration-200 flex items-center gap-3 ${
                activePage === 'home' ? 'bg-red-800/50 font-semibold text-red-300' : 'text-red-400'
              }`}
              onClick={() => {
                setActivePage('home');
                setMenuOpen(false);
              }}
            >
              <FiHome size={18} />
              Home
            </button>
            <button
              className={`w-full text-left p-3 hover:bg-blue-800/40 transition-all duration-200 flex items-center gap-3 ${
                activePage === 'profile' ? 'bg-blue-800/50 font-semibold text-blue-300' : 'text-blue-400'
              }`}
              onClick={() => {
                setActivePage('profile');
                setMenuOpen(false);
              }}
            >
              <FiUser size={18} />
              Profile
            </button>
            <button
              className="w-full text-left p-3 hover:bg-red-700/50 text-red-500 font-semibold transition-all duration-200 flex items-center gap-3"
              onClick={handleLogout}
            >
              <FiLogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start relative z-10">{renderPage()}</main>
    </div>
  );
}
