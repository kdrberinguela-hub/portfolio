'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getToken, logoutUser } from '@/lib/auth';
import { FiHome, FiUser, FiLogOut, FiEdit, FiMail, FiPhone, FiSave, FiX, FiStar, FiAward, FiSend } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface User {
  name: string;
  email: string;
  phone: string;
}

interface Request {
  request_id: number;
  student_name: string;
  student_number: string;
  course: string;
  year_level: number;
  request_type: 'Enrollment' | 'Room Change' | 'Status Update';
  details: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submitted_at: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<'home' | 'profile' | 'enroll'>('home');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<User>({ name: '', email: '', phone: '' });
  const [menuOpen, setMenuOpen] = useState(false);

  const [requests, setRequests] = useState<Request[]>([]);
  const [message, setMessage] = useState('');

  // Enrollment form state
  const [studentNumber, setStudentNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('');
  const [yearLevel, setYearLevel] = useState(1);

  // Sections map by year
  const [sectionMap] = useState<Record<number, string[]>>({
    1: ['101','102','103','104','105'],
    2: ['201','202','203','204','205'],
    3: ['301','302','303','304','305'],
    4: ['401','402','403','404','405'],
  });

  const approvedEnrollments = requests.filter(
    r => r.request_type === 'Enrollment' && r.status === 'Approved'
  );

  // ===== Effects =====
  useEffect(() => {
    const t = getToken();
    if (!t) return router.push('/login');
    setToken(t);

    const savedUser = localStorage.getItem('user');
    const defaultUser: User = {
      name: 'Kenneth Driethyn R. Beringuela, BSIT-2A',
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

    const savedRequests = localStorage.getItem(`requests_${t}`);
    if (savedRequests) setRequests(JSON.parse(savedRequests));
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!token) return;
      const savedRequests = localStorage.getItem(`requests_${token}`);
      if (savedRequests) setRequests(JSON.parse(savedRequests));
    }, 1000);
    return () => clearInterval(interval);
  }, [token]);

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

  const handleRequestEnroll = () => {
    if (!studentNumber || !fullName || !email || !course) {
      setMessage('Please fill in all required fields');
      return;
    }

    const newEnroll: Request = {
      request_id: Date.now(),
      student_name: fullName,
      student_number: studentNumber,
      course,
      year_level: yearLevel,
      request_type: 'Enrollment',
      details: `Course: ${course}, Year: ${yearLevel}, Email: ${email}, Phone: ${phone}`,
      status: 'Pending',
      submitted_at: new Date().toISOString(),
    };

    const updated = [...requests, newEnroll];
    setRequests(updated);
    if (token) localStorage.setItem(`requests_${token}`, JSON.stringify(updated));

    setMessage('Enrollment request sent!');
    setStudentNumber('');
    setFullName('');
    setEmail('');
    setPhone('');
    setCourse('');
    setYearLevel(1);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all enrollment requests?')) {
      if (token) {
        localStorage.removeItem(`requests_${token}`);
        setRequests([]);
        setMessage('All requests cleared!');
      }
    }
  };

  // ===== Render =====
  const renderPage = () => {
    if (activePage === 'home') return <div className="w-full">{children}</div>;

    if (activePage === 'profile') {
      return (
        <div className="relative w-full max-w-5xl p-10 bg-slate-900/80 rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden backdrop-blur-md">
          <h2 className="text-5xl font-extrabold mb-10 text-white text-center drop-shadow-lg">Profile</h2>

          <div className="relative mb-8 mx-auto w-fit">
            <div className="p-3 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 rounded-full animate-spin-slow shadow-2xl">
              <img
                src="/profile.png"
                alt="Profile Photo"
                className="w-36 h-36 rounded-full object-cover shadow-2xl border-4 border-white/30"
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 blur-3xl animate-pulse"></div>
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-full shadow-lg">
              <FiStar className="text-white" size={16} />
            </div>
          </div>

          <div className="text-center mb-8">
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="text-4xl font-bold text-white bg-slate-800/80 px-6 py-3 rounded-2xl border border-slate-700/50 text-center mb-4 shadow-lg focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            ) : (
              <h3 className="text-4xl font-bold text-white mb-4">{user?.name}</h3>
            )}
            <div className="inline-flex items-center gap-3 bg-slate-800/70 px-6 py-3 rounded-2xl border border-slate-700/50 shadow-lg">
              <FiAward className="text-emerald-400" size={20} />
              <p className="text-emerald-400 font-semibold text-base">CREATOR</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800/70 p-6 rounded-2xl border border-slate-700/50 text-center shadow-lg">
              <FiMail className="text-indigo-400 mx-auto mb-3" size={28} />
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="text-2xl font-bold text-cyan-400 bg-transparent border-none outline-none text-center focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1 transition-all"
                />
              ) : (
                <p className="text-2xl font-bold text-cyan-400">{user?.email}</p>
              )}
              <p className="text-slate-400 text-sm mt-2">Registered Email</p>
            </div>

            <div className="bg-slate-800/70 p-6 rounded-2xl border border-slate-700/50 text-center shadow-lg">
              <FiPhone className="text-emerald-400 mx-auto mb-3" size={28} />
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="text-2xl font-bold text-cyan-400 bg-transparent border-none outline-none text-center focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1 transition-all"
                />
              ) : (
                <p className="text-2xl font-bold text-cyan-400">{user?.phone}</p>
              )}
              <p className="text-slate-400 text-sm mt-2">Registered Phone</p>
            </div>
          </div>

          <div className="text-center">
            {isEditing ? (
              <div className="flex justify-center gap-6">
                <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <FiSave className="mr-2" /> Save Changes
                </Button>
                <Button onClick={handleCancel} className="bg-red-600 hover:bg-red-700 text-white">
                  <FiX className="mr-2" /> Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={handleEditToggle} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <FiEdit className="mr-2" /> Edit Profile
              </Button>
            )}
          </div>
        </div>
      );
    }

    // ===== Enrollment Page =====
    return (
      <div className="relative w-full max-w-5xl p-10 bg-slate-900/80 rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden backdrop-blur-md">
        <h2 className="text-5xl font-extrabold mb-10 text-white text-center drop-shadow-lg">Student Enrollment</h2>

        {/* Enrollment Form */}
        <Card className="w-full max-w-md mx-auto bg-slate-800/70 shadow-lg mb-6">
          <CardContent className="space-y-4">
            {message && <p className="text-green-600">{message}</p>}
            <Input type="text" placeholder="Student Number" value={studentNumber} onChange={e => setStudentNumber(e.target.value)} className="bg-slate-700 text-white border-slate-600"/>
            <Input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className="bg-slate-700 text-white border-slate-600"/>
            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="bg-slate-700 text-white border-slate-600"/>
            <Input type="tel" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} className="bg-slate-700 text-white border-slate-600"/>
            <Input type="text" placeholder="Course" value={course} onChange={e => setCourse(e.target.value)} className="bg-slate-700 text-white border-slate-600"/>
            <Input type="number" placeholder="Year Level" value={yearLevel} onChange={e => setYearLevel(Number(e.target.value))} className="bg-slate-700 text-white border-slate-600"/>
            <Button onClick={handleRequestEnroll} className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center">
              Send Enrollment Request <FiSend className="ml-2"/>
            </Button>
          </CardContent>
        </Card>

        {/* Approved Enrollments */}
        {approvedEnrollments.length > 0 && (
          <Card className="w-full max-w-md mx-auto bg-slate-800/70 shadow-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-white">Approved Enrollments</h3>
              <Button
                onClick={handleClearHistory}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              >
                Clear History
              </Button>
            </div>

            {approvedEnrollments.map((r) => (
              <div key={r.request_id} className="border rounded p-2 mb-2 bg-slate-700/50">
                <p className="text-white font-semibold">{r.student_name} ({r.student_number})</p>
                <p className="text-white">Course: {r.course}, Year: {r.year_level}</p>
                <p className="text-white font-semibold">Sections:</p>
                <ul className="text-white list-disc list-inside">
                  {sectionMap[r.year_level]?.map(section => (
                    <li key={section}>{section}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 relative overflow-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-8 relative z-20">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
          {activePage === 'home' ? 'Dashboard' : activePage === 'profile' ? 'Profile' : 'Enrollment'}
        </h1>

        {/* User Menu */}
        <div className="relative">
          <Button onClick={() => setMenuOpen(!menuOpen)} className="p-4 rounded-2xl bg-slate-800/80 text-white shadow-lg hover:bg-slate-700 transition-all duration-300">
            <FiUser size={26}/>
          </Button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-slate-900 rounded-2xl shadow-xl p-4 flex flex-col gap-2">
              <Button variant="ghost" className="justify-start text-white flex items-center gap-2" onClick={() => { setActivePage('home'); setMenuOpen(false); }}>
                <FiHome /> Home
              </Button>
              <Button variant="ghost" className="justify-start text-white flex items-center gap-2" onClick={() => { setActivePage('profile'); setMenuOpen(false); }}>
                <FiUser /> Profile
              </Button>
              <Button variant="ghost" className="justify-start text-white flex items-center gap-2" onClick={() => { setActivePage('enroll'); setMenuOpen(false); }}>
                <FiSend /> Enrollment
              </Button>
              <Button variant="ghost" className="justify-start text-red-500 flex items-center gap-2" onClick={handleLogout}>
                <FiLogOut /> Logout
              </Button>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-start relative z-10">{renderPage()}</main>
    </div>
  );
}
