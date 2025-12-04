'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getToken, logoutUser } from '@/lib/auth';
import { FiHome, FiUser, FiLogOut, FiEdit, FiMail, FiPhone, FiSave, FiX, FiStar, FiAward } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface User {
  name: string;
  email: string;
  phone: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<'home' | 'profile'>('home');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<User>({ name: '', email: '', phone: '' });
  const [menuOpen, setMenuOpen] = useState(false);

  // ===== Effects =====
  useEffect(() => {
    const t = getToken();
    if (!t) return router.push('/login');

    setToken(t);
    const savedUser = localStorage.getItem('user');
    const defaultUser: User = {
      name: 'Kenneth Driethyn R. Beringuela',
      email: 'kdrberinguela@gbox.ncf.edu.ph',
      phone: '09922287182',
    };

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setEditForm(parsedUser);
    } else {
      setUser(defaultUser);
      setEditForm(defaultUser);
    }
  }, [router]);

  // ===== Handlers =====
  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) setEditForm(user || { name: '', email: '', phone: '' });
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

  // ===== Render =====
  const renderPage = () => {
    if (activePage === 'home') return <div className="w-full">{children}</div>;

    // Profile Page
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white/95 backdrop-blur-md">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-2">My Profile</h2>
              <p className="text-white/80">Manage your account information</p>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          </div>

          <CardContent className="p-8">
            {/* Profile Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full p-1 shadow-xl">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <FiUser className="w-16 h-16 text-gray-600" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-full shadow-lg">
                  <FiStar className="text-white w-4 h-4" />
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full border border-emerald-200 mb-4">
                  <FiAward className="text-emerald-600 w-5 h-5" />
                  <span className="text-emerald-700 font-semibold text-sm">STUDENT</span>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors text-lg font-medium bg-white/80"
                  />
                ) : (
                  <div className="w-full h-14 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 flex items-center">
                    <FiUser className="text-indigo-500 w-5 h-5 mr-3" />
                    <span className="text-lg font-medium text-gray-800">{user?.name}</span>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors text-lg font-medium bg-white/80"
                  />
                ) : (
                  <div className="w-full h-14 px-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 flex items-center">
                    <FiMail className="text-emerald-500 w-5 h-5 mr-3" />
                    <span className="text-lg font-medium text-gray-800">{user?.email}</span>
                  </div>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors text-lg font-medium bg-white/80"
                  />
                ) : (
                  <div className="w-full h-14 px-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 flex items-center">
                    <FiPhone className="text-purple-500 w-5 h-5 mr-3" />
                    <span className="text-lg font-medium text-gray-800">{user?.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleSave} 
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <FiSave className="w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button 
                    onClick={handleCancel} 
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleEditToggle} 
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <FiEdit className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Modern Header with Glass Effect */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {activePage === 'home' ? 'Student Dashboard' : 'My Profile'}
              </h1>
              <p className="text-gray-600 mt-1 font-medium">
                {activePage === 'home' ? 'Welcome to your student portal' : 'Manage your account information'}
              </p>
            </div>

            {/* User Menu */}
            <div className="relative">
              <Button 
                onClick={() => setMenuOpen(!menuOpen)} 
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <FiUser className="w-4 h-4" />
                Menu
              </Button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-2 z-50">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl p-3 mb-1 transition-colors" 
                    onClick={() => { setActivePage('home'); setMenuOpen(false); }}
                  >
                    <FiHome className="w-4 h-4 mr-3" />
                    Dashboard Home
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl p-3 mb-1 transition-colors" 
                    onClick={() => { setActivePage('profile'); setMenuOpen(false); }}
                  >
                    <FiUser className="w-4 h-4 mr-3" />
                    My Profile
                  </Button>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl p-3 transition-colors" 
                    onClick={handleLogout}
                  >
                    <FiLogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {renderPage()}
      </main>

      {/* Click outside to close menu */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}