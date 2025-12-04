'use client';

import React, { useEffect, useState } from 'react';
import { getToken, logoutUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiEdit, FiTrash2, FiPlus, FiUsers, FiInbox } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

interface Student {
  student_id: string;
  student_number: string;
  full_name: string;
  email: string;
  phone: string;
  course: string;
  year_level: number;
  room: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  enrollment_date: string;
  created_at: string;
}

interface Request {
  request_id: string;
  student_name: string;
  student_number: string;
  request_type: 'Enrollment' | 'Room Change' | 'Status Update';
  details: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submitted_at: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const roomsByCourseYear: Record<string, Record<number, string[]>> = {
  BSCS: { 1: ['1A','1B','1C','1D','1E'], 2: ['2A','2B','2C','2D','2E'], 3: ['3A','3B','3C','3D','3E'], 4: ['4A','4B','4C','4D','4E'] },
  BSIT: { 1: ['1A','1B','1C','1D','1E'], 2: ['2A','2B','2C','2D','2E'], 3: ['3A','3B','3C','3D','3E'], 4: ['4A','4B','4C','4D','4E'] },
  BSBA: { 1: ['1A','1B','1C','1D','1E'], 2: ['2A','2B','2C','2D','2E'], 3: ['3A','3B','3C','3D','3E'], 4: ['4A','4B','4C','4D','4E'] },
  BSA: { 1: ['1A','1B','1C','1D','1E'], 2: ['2A','2B','2C','2D','2E'], 3: ['3A','3B','3C','3D','3E'], 4: ['4A','4B','4C','4D','4E'] },
  BSHM: { 1: ['1A','1B','1C','1D','1E'], 2: ['2A','2B','2C','2D','2E'], 3: ['3A','3B','3C','3D','3E'], 4: ['4A','4B','4C','4D','4E'] },
  BEED: { 1: ['1A','1B','1C','1D','1E'], 2: ['2A','2B','2C','2D','2E'], 3: ['3A','3B','3C','3D','3E'], 4: ['4A','4B','4C','4D','4E'] },
  BSED: { 1: ['1A','1B','1C','1D','1E'], 2: ['2A','2B','2C','2D','2E'], 3: ['3A','3B','3C','3D','3E'], 4: ['4A','4B','4C','4D','4E'] },
  'BS Criminology': { 1: ['1A','1B','1C','1D','1E'], 2: ['2A','2B','2C','2D','2E'], 3: ['3A','3B','3C','3D','3E'], 4: ['4A','4B','4C','4D','4E'] },
  BSPSY: { 1: ['1A','1B','1C','1D','1E'], 2: ['2A','2B','2C','2D','2E'], 3: ['3A','3B','3C','3D','3E'], 4: ['4A','4B','4C','4D','4E'] },
  BSECE: { 1: ['1A','1B','1C','1D','1E'], 2: ['2A','2B','2C','2D','2E'], 3: ['3A','3B','3C','3D','3E'], 4: ['4A','4B','4C','4D','4E'] },
};

export default function TeacherDashboardPage() {
  const router = useRouter();
  const token = getToken();

  const [students, setStudents] = useState<Student[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [activeSection, setActiveSection] = useState<'students'|'requests'>('students');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    student_number:'', full_name:'', email:'', phone:'', course:'', year_level:1, status:'Active', enrollment_date:new Date().toISOString().split('T')[0], created_at:new Date().toISOString()
  });
  const [activeYear, setActiveYear] = useState<number|null>(null);
  const [activeCourse, setActiveCourse] = useState<string|null>(null);
  const [activeRoom, setActiveRoom] = useState<string|null>(null);

  // Load students & requests
  useEffect(()=>{
    if(!token) return router.push('/login');

    const savedStudents = localStorage.getItem(`students_${token}`);
    const globalStudents = localStorage.getItem('students_all');

    if(savedStudents){
      setStudents(JSON.parse(savedStudents));
    } else if(globalStudents){
      setStudents(JSON.parse(globalStudents));
      localStorage.setItem(`students_${token}`, globalStudents);
    }

    const savedRequests = localStorage.getItem('requests_all');
    if(savedRequests) setRequests(JSON.parse(savedRequests));
  },[token]);

  useEffect(()=>{
    const interval = setInterval(()=>{
      const savedRequests = localStorage.getItem('requests_all');
      if(savedRequests) setRequests(JSON.parse(savedRequests));
    },5000);
    return ()=>clearInterval(interval);
  },[]);

  const showToast=(msg:string,type:'success'|'error'|'info'='info')=>{
    const id=uuidv4();
    setToasts(prev=>[...prev,{id,message:msg,type}]);
    setTimeout(()=>setToasts(prev=>prev.filter(t=>t.id!==id)),4000);
  };

  const handleLogout=()=>{ logoutUser(); router.push('/login'); };

  // --- Student CRUD ---
  const handleDeleteStudent=(id:string)=>{
    const updated=students.filter(s=>s.student_id!==id);
    setStudents(updated);
    localStorage.setItem(`students_${token}`,JSON.stringify(updated));
    localStorage.setItem('students_all',JSON.stringify(updated));
    showToast('Student deleted','info');
  };

  const handleEditStudent=(student:Student)=>setEditingStudent(student);

  const handleUpdateStudent=()=>{
    if(!editingStudent) return;
    const updated = students.map(s =>
      s.student_id === editingStudent.student_id ? editingStudent : s
    );
    setStudents(updated);
    localStorage.setItem(`students_${token}`, JSON.stringify(updated));
    localStorage.setItem('students_all', JSON.stringify(updated));
    showToast(`Student ${editingStudent.full_name} updated successfully`, 'success');
    setEditingStudent(null);
  };

  const handleAddStudent=()=>{
    if(!newStudent.full_name || !newStudent.student_number || !newStudent.course){
      showToast('Please fill required fields','error'); 
      return; 
    }
    const courseRooms=roomsByCourseYear[newStudent.course!];
    const yearRooms=courseRooms ? courseRooms[newStudent.year_level!] : ['A'];
    const sameCourseYear=students.filter(s=>s.course===newStudent.course && s.year_level===newStudent.year_level);
    const assignedRoom=yearRooms[sameCourseYear.length % yearRooms.length];
    const studentToAdd:Student={...newStudent, student_id:uuidv4(), room:assignedRoom} as Student;
    const updated=[...students,studentToAdd];
    setStudents(updated);
    localStorage.setItem(`students_${token}`,JSON.stringify(updated));
    localStorage.setItem('students_all',JSON.stringify(updated));
    showToast(`Student added. Assigned to room ${assignedRoom}`,'success');
    setNewStudent({student_number:'',full_name:'',email:'',phone:'',course:'',year_level:1,status:'Active',enrollment_date:new Date().toISOString().split('T')[0],created_at:new Date().toISOString()});
    setShowAddForm(false);
  };

  // --- Request Handling ---
  const handleRequestAction=(request:Request,action:'Approved'|'Rejected')=>{
    const updatedRequests=requests.map(r=>r.request_id===request.request_id ? {...r,status:action} : r);
    setRequests(updatedRequests);
    localStorage.setItem('requests_all',JSON.stringify(updatedRequests));
    showToast(`Request ${action.toLowerCase()}`,'success');

    if(action==='Approved' && request.request_type==='Enrollment'){
      try{
        const courseMatch=request.details.match(/Course\s*:\s*(\w[\w\s]*)/i);
        const yearMatch=request.details.match(/Year\s*:\s*(\d)/i);
        const course=courseMatch ? courseMatch[1].trim() : 'BSCS';
        const year_level=yearMatch ? parseInt(yearMatch[1]) : 1;
        const courseRooms=roomsByCourseYear[course];
        const yearRooms=courseRooms ? courseRooms[year_level] : ['A'];
        const sameCourseYear=students.filter(s=>s.course===course && s.year_level===year_level);
        const assignedRoom=yearRooms[sameCourseYear.length % yearRooms.length];
        const newStudent:Student={ student_id:uuidv4(), student_number:request.student_number, full_name:request.student_name, email:'', phone:'', course, year_level, status:'Active', enrollment_date:new Date().toISOString().split('T')[0], created_at:new Date().toISOString(), room:assignedRoom };
        const updatedStudents=[...students,newStudent];
        setStudents(updatedStudents);
        localStorage.setItem(`students_${token}`,JSON.stringify(updatedStudents));
        localStorage.setItem('students_all',JSON.stringify(updatedStudents));
        showToast(`Student ${request.student_name} enrolled in room ${assignedRoom}`,'success');
      }catch(e){ console.error(e); showToast('Failed to enroll student','error'); }
    }
  };

  const handleClearHistory=()=>{
    if(confirm('Are you sure you want to clear all requests?')){
      setRequests([]);
      localStorage.setItem('requests_all',JSON.stringify([]));
      showToast('All requests cleared','info');
    }
  };

  // --- Navigation Helpers ---
  const getCoursesInYear=(year:number)=>Array.from(new Set(students.filter(s=>s.year_level===year).map(s=>s.course)));
  const getRoomsInCourseYear=(year:number,course:string)=>Array.from(new Set(students.filter(s=>s.year_level===year && s.course===course).map(s=>s.room)));
  const getStudentsInRoom=(year:number,course:string,room:string)=>students.filter(s=>s.year_level===year && s.course===course && s.room===room);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Modern Header with Glass Effect */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Teacher Dashboard
              </h1>
              <p className="text-gray-600 mt-1 font-medium">Manage students and enrollment requests</p>
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

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Edit Student Modal with Enhanced Design */}
        {editingStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-white shadow-2xl border-0 rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 p-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <FiEdit className="w-6 h-6" />
                  Edit Student Information
                </h3>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Student Number</label>
                    <Input 
                      value={editingStudent.student_number} 
                      onChange={e=>setEditingStudent({...editingStudent, student_number:e.target.value})} 
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <Input 
                      value={editingStudent.full_name} 
                      onChange={e=>setEditingStudent({...editingStudent, full_name:e.target.value})} 
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <Input 
                      value={editingStudent.email} 
                      onChange={e=>setEditingStudent({...editingStudent, email:e.target.value})} 
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <Input 
                      value={editingStudent.phone} 
                      onChange={e=>setEditingStudent({...editingStudent, phone:e.target.value})} 
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
                    <Input 
                      value={editingStudent.course} 
                      onChange={e=>setEditingStudent({...editingStudent, course:e.target.value})} 
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Year Level</label>
                    <Input 
                      type="number" 
                      value={editingStudent.year_level} 
                      onChange={e=>setEditingStudent({...editingStudent, year_level:parseInt(e.target.value)})} 
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <Input 
                    value={editingStudent.status} 
                    onChange={e=>setEditingStudent({...editingStudent, status:e.target.value as any})} 
                    className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button 
                    onClick={handleUpdateStudent} 
                    className="flex-1 h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Save Changes
                  </Button>
                  <Button 
                    onClick={()=>setEditingStudent(null)} 
                    className="flex-1 h-14 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Navigation Tabs */}
        <div className="flex gap-4 mb-10">
          <Button 
            onClick={()=>setActiveSection('students')} 
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 ${
              activeSection==='students'
                ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl shadow-blue-500/25' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-gray-800 border-2 border-gray-200 hover:border-gray-300 shadow-lg'
            }`}
          >
            <FiUsers className="w-5 h-5" /> 
            Manage Students
          </Button>
          <Button 
            onClick={()=>setActiveSection('requests')} 
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 relative ${
              activeSection==='requests'
                ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-xl shadow-purple-500/25' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-gray-800 border-2 border-gray-200 hover:border-gray-300 shadow-lg'
            }`}
          >
            <FiInbox className="w-5 h-5" /> 
            Student Requests
            {requests.filter(r=>r.status==='Pending').length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                {requests.filter(r=>r.status==='Pending').length}
              </span>
            )}
          </Button>
        </div>

        {/* Students Section */}
        {activeSection==='students' && (
          <>
            {/* Add Student Form with Beautiful Design */}
            <div className="flex gap-3 mb-8">
              <Button 
                onClick={()=>setShowAddForm(!showAddForm)} 
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <FiPlus className="w-5 h-5" /> 
                Add New Student
              </Button>
            </div>

            {showAddForm && (
              <Card className="mb-8 border-0 shadow-xl rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 p-6">
                  <h3 className="text-2xl font-bold text-white">Add New Student</h3>
                  <p className="text-emerald-100">Fill in the student information below</p>
                </div>
                <CardContent className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Student Number *</label>
                      <Input 
                        value={newStudent.student_number} 
                        onChange={e=>setNewStudent({...newStudent,student_number:e.target.value})} 
                        placeholder="Enter student number"
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <Input 
                        value={newStudent.full_name} 
                        onChange={e=>setNewStudent({...newStudent,full_name:e.target.value})} 
                        placeholder="Enter full name"
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <Input 
                        value={newStudent.email} 
                        onChange={e=>setNewStudent({...newStudent,email:e.target.value})} 
                        placeholder="Enter email address"
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <Input 
                        value={newStudent.phone} 
                        onChange={e=>setNewStudent({...newStudent,phone:e.target.value})} 
                        placeholder="Enter phone number"
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Course *</label>
                      <Input 
                        value={newStudent.course} 
                        onChange={e=>setNewStudent({...newStudent,course:e.target.value})} 
                        placeholder="Enter course"
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Year Level</label>
                      <Input 
                        type="number" 
                        value={newStudent.year_level} 
                        onChange={e=>setNewStudent({...newStudent,year_level:Number(e.target.value)})} 
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <Button 
                      onClick={handleAddStudent} 
                      className="flex-1 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Add Student
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Navigation with Beautiful Cards */}
            {!activeYear && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {[1,2,3,4].map(y=>(
                  <Button
                    key={y}
                    onClick={()=>setActiveYear(y)} 
                    className="h-32 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0"
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">Year {y}</div>
                      <div className="text-blue-100 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                        {students.filter(s=>s.year_level===y).length} students
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {activeYear && !activeCourse && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCoursesInYear(activeYear).map(c=>(
                    <Button
                      key={c}
                      onClick={()=>setActiveCourse(c)} 
                      className="h-24 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0"
                    >
                      <div className="text-center">
                        <div className="text-xl font-bold mb-1">{c}</div>
                        <div className="text-emerald-100 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                          {students.filter(s=>s.year_level===activeYear && s.course===c).length} students
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={()=>setActiveYear(null)} 
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  ← Back to Years
                </Button>
              </div>
            )}

            {activeYear && activeCourse && !activeRoom && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {getRoomsInCourseYear(activeYear, activeCourse).map(room => (
                    <Button
                      key={room}
                      onClick={() => setActiveRoom(room)}
                      className="h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0"
                    >
                      <div className="text-center">
                        <div className="font-bold text-lg">Room {room}</div>
                        <div className="text-purple-100 text-sm">
                          {students.filter(s => s.year_level === activeYear && s.course === activeCourse && s.room === room).length} students
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={() => setActiveCourse(null)}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  ← Back to Courses
                </Button>
              </div>
            )}

            {/* Enhanced Student List */}
            {activeYear && activeCourse && activeRoom && (
              <>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {activeCourse} – Year {activeYear} – Room {activeRoom}
                  </h2>
                </div>

                <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
                    <h3 className="text-xl font-bold text-white">Student List</h3>
                  </div>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Student #</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Phone</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getStudentsInRoom(activeYear, activeCourse, activeRoom).map(student => (
                            <tr key={student.student_id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors">
                              <td className="px-6 py-4 font-medium text-gray-900">{student.student_number}</td>
                              <td className="px-6 py-4 font-medium text-gray-900">{student.full_name}</td>
                              <td className="px-6 py-4 text-gray-600">{student.email}</td>
                              <td className="px-6 py-4 text-gray-600">{student.phone}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  student.status === 'Active' ? 'bg-green-100 text-green-800' :
                                  student.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {student.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 flex gap-2">
                                <Button
                                  onClick={() => handleEditStudent(student)}
                                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0"
                                >
                                  <FiEdit className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteStudent(student.student_id)}
                                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
                      <Button
                        onClick={() => setActiveRoom(null)}
                        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        ← Back to Rooms
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}

        {/* Enhanced Requests Section */}
        {activeSection === 'requests' && (
          <div>
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Student Requests</h2>
                    <p className="text-purple-100">Manage enrollment and update requests</p>
                  </div>
                  <Button
                    onClick={handleClearHistory}
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <FiTrash2 className="w-4 h-4 mr-2" />
                    Clear History
                  </Button>
                </div>
              </div>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700">Name</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700">Student #</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700">Type</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700">Details</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map(request => (
                        <tr key={request.request_id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{request.student_name}</td>
                          <td className="px-6 py-4 text-gray-600">{request.student_number}</td>
                          <td className="px-6 py-4 text-gray-600">{request.request_type}</td>
                          <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{request.details}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            {request.status === 'Pending' && (
                              <>
                                <Button
                                  onClick={() => handleRequestAction(request, 'Approved')}
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0"
                                >
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleRequestAction(request, 'Rejected')}
                                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0"
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Toast Notifications */}
        <div className="fixed bottom-6 right-6 space-y-3 z-50">
          {toasts.map(t => (
            <div
              key={t.id}
              className={`p-4 rounded-2xl shadow-2xl text-white backdrop-blur-sm border-l-4 transform transition-all duration-500 animate-in slide-in-from-right ${
                t.type === 'success'
                  ? 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400'
                  : t.type === 'error'
                  ? 'bg-gradient-to-r from-red-500/90 to-pink-500/90 border-red-400'
                  : 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90 border-blue-400'
              }`}
            >
              <div className="font-medium">{t.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}