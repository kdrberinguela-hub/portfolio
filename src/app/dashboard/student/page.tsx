'use client';

import React, { useState, useEffect } from 'react';
import { getToken, logoutUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { 
  FiLogOut, FiSend, FiTrash2, FiUser, FiMail, FiPhone, 
  FiBook, FiCalendar, FiCheckCircle, FiClock, FiAlertCircle 
} from 'react-icons/fi';

interface Request {
  request_id: number;
  student_name: string;
  student_number: string;
  request_type: 'Enrollment' | 'Room Change' | 'Status Update';
  details: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submitted_at: string;
}

const coursesPH = [
  'BSCS', 'BSIT', 'BSCE', 'BSECE', 'BSME', 'BSA', 'BSCrim', 'BSTM', 'BSHRM', 'BSOA', 'BSBio', 'BSPsych'
];

export default function StudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Form fields
  const [studentNumber, setStudentNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('');
  const [yearLevel, setYearLevel] = useState(1);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  // Requests
  const [requests, setRequests] = useState<Request[]>([]);
  const [currentStudent, setCurrentStudent] = useState(''); // tracks current student for history

  // Load token and redirect if missing
  useEffect(() => {
    const t = getToken();
    if (!t) {
      router.push('/login');
    } else {
      setToken(t);
      setLoading(false);
      loadRequests();
    }
  }, [router]);

  // Load all requests from localStorage
  const loadRequests = () => {
    const saved = localStorage.getItem('requests_all');
    setRequests(saved ? JSON.parse(saved) : []);
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleRequestEnroll = () => {
    if (!studentNumber || !fullName || !email || !course) {
      showMessage('Please fill in all required fields', 'error');
      return;
    }

    // Check for duplicate pending requests
    const existingPending = requests.find(
      r => r.student_number === studentNumber && r.status === 'Pending'
    );
    
    if (existingPending) {
      showMessage('You already have a pending enrollment request', 'error');
      return;
    }

    const newRequest: Request = {
      request_id: Date.now(),
      student_name: fullName,
      student_number: studentNumber,
      request_type: 'Enrollment',
      details: `Course: ${course}, Year: ${yearLevel}, Email: ${email}, Phone: ${phone}`,
      status: 'Pending',
      submitted_at: new Date().toISOString(),
    };

    const saved = localStorage.getItem('requests_all');
    const list: Request[] = saved ? JSON.parse(saved) : [];
    list.push(newRequest);
    localStorage.setItem('requests_all', JSON.stringify(list));

    showMessage('🎉 Enrollment request submitted successfully!', 'success');

    // Keep studentNumber for history display
    setCurrentStudent(studentNumber);

    // Reset other fields ONLY
    setFullName('');
    setEmail('');
    setPhone('');
    setCourse('');
    setYearLevel(1);

    loadRequests(); // Refresh history immediately
  };

  const handleClearHistory = () => {
    if (!currentStudent) return;

    if (confirm('Are you sure you want to clear your request history?')) {
      const saved = localStorage.getItem('requests_all');
      let list: Request[] = saved ? JSON.parse(saved) : [];
      list = list.filter(r => r.student_number !== currentStudent);
      localStorage.setItem('requests_all', JSON.stringify(list));
      setRequests(list);
      showMessage('Request history cleared successfully', 'info');
    }
  };

  // Auto-refresh requests every 2 seconds
  useEffect(() => {
    const interval = setInterval(loadRequests, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Filter requests for the current student AND only Pending
  const myRequests = requests.filter(
    r => r.student_number === currentStudent && r.status === 'Pending'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Modern Header with Glass Effect */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Student Enrollment Portal
              </h1>
              <p className="text-gray-600 mt-1 font-medium">Submit your enrollment request</p>
            </div>
            <Button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-2xl shadow-lg border-l-4 transform transition-all duration-500 animate-in slide-in-from-top ${
            messageType === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 text-green-800'
              : messageType === 'error'
              ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-400 text-red-800'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 text-blue-800'
          }`}>
            <div className="flex items-center gap-2">
              {messageType === 'success' && <FiCheckCircle className="w-5 h-5" />}
              {messageType === 'error' && <FiAlertCircle className="w-5 h-5" />}
              {messageType === 'info' && <FiClock className="w-5 h-5" />}
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrollment Form */}
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FiUser className="w-6 h-6" />
                Enrollment Request Form
              </h2>
              <p className="text-blue-100 mt-1">Fill in your information below</p>
            </div>
            <CardContent className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Student Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your student number"
                    value={studentNumber}
                    onChange={e => setStudentNumber(e.target.value)}
                    className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 focus:border-blue-500 focus:ring-0 transition-colors bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 focus:border-blue-500 focus:ring-0 transition-colors bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 focus:border-blue-500 focus:ring-0 transition-colors bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiPhone className="w-4 h-4" />
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 focus:border-blue-500 focus:ring-0 transition-colors bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiBook className="w-4 h-4" />
                    Course *
                  </label>
                  <select
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                    className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 focus:border-blue-500 focus:ring-0 transition-colors bg-white/80 backdrop-blur-sm"
                  >
                    <option value="">Select your course</option>
                    {coursesPH.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    Year Level
                  </label>
                  <select
                    value={yearLevel}
                    onChange={e => setYearLevel(Number(e.target.value))}
                    className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 focus:border-blue-500 focus:ring-0 transition-colors bg-white/80 backdrop-blur-sm"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>

                <Button
                  onClick={handleRequestEnroll}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
                >
                  <FiSend className="w-5 h-5 mr-3" />
                  Submit Enrollment Request
                </Button>

                <div className="text-sm text-gray-600 bg-white/60 p-4 rounded-xl border border-gray-200">
                  <p className="font-medium mb-2">📋 Required Information:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Student Number (must be unique)</li>
                    <li>• Full Name (as it appears on official documents)</li>
                    <li>• Valid Email Address</li>
                    <li>• Course Selection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request History */}
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FiClock className="w-6 h-6" />
                    Your Pending Requests
                  </h2>
                  <p className="text-purple-100 mt-1">Track your enrollment status</p>
                </div>
                {currentStudent && (
                  <Button
                    onClick={handleClearHistory}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <FiTrash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {myRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiClock className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Pending Requests</h3>
                    <p className="text-gray-500">Submit an enrollment request to get started</p>
                  </div>
                ) : (
                  myRequests.map(r => (
                    <div key={r.request_id} className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <FiUser className="w-5 h-5 text-blue-500" />
                            {r.student_name}
                          </h3>
                          <p className="text-gray-600 font-medium">ID: {r.student_number}</p>
                        </div>
                        <span className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                          <FiClock className="w-4 h-4" />
                          {r.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiBook className="w-4 h-4" />
                          <span className="font-medium">Type:</span> {r.request_type}
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <FiCalendar className="w-4 h-4 mt-0.5" />
                          <div>
                            <span className="font-medium">Details:</span>
                            <p className="mt-1 text-gray-700">{r.details}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-200">
                        <FiCalendar className="w-4 h-4" />
                        <span>Submitted: {new Date(r.submitted_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {myRequests.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700">
                    <FiClock className="w-4 h-4" />
                    <span className="font-medium text-sm">Processing Status</span>
                  </div>
                  <p className="text-blue-600 text-sm mt-1">
                    Your request is being reviewed by the administration. You'll receive an update once processed.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5" />
                Step 1: Submit
              </h3>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Fill out the enrollment form with accurate information</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <FiClock className="w-5 h-5" />
                Step 2: Review
              </h3>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Administration reviews your request within 24-48 hours</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <FiUser className="w-5 h-5" />
                Step 3: Enrollment
              </h3>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Once approved, you'll be officially enrolled</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}