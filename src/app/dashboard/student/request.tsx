'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function StudentRequest() {
  const [studentNumber, setStudentNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [yearLevel, setYearLevel] = useState(1);
  const [message, setMessage] = useState('');

  // Load previous requests (optional)
  const [requests, setRequests] = useState<any[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem('enrollRequests_all');
    setRequests(saved ? JSON.parse(saved) : []);
  }, []);

  const handleSendRequest = () => {
    if (!studentNumber || !fullName || !email || !course) {
      setMessage('Fill all required fields');
      return;
    }

    const newRequest = {
      requestId: Date.now(),
      student_number: studentNumber,
      full_name: fullName,
      email,
      course,
      year_level: yearLevel,
      status: 'Pending',
      created_at: new Date().toISOString(),
    };

    const saved = localStorage.getItem('enrollRequests_all');
    const list = saved ? JSON.parse(saved) : [];
    list.push(newRequest);
    localStorage.setItem('enrollRequests_all', JSON.stringify(list));

    setMessage('Request sent!');
    setStudentNumber('');
    setFullName('');
    setEmail('');
    setCourse('');
    setYearLevel(1);
    setRequests(list); // update state to show immediately
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Card className="mb-4">
        <CardContent className="space-y-2">
          {message && <p className="text-green-600">{message}</p>}
          <input type="text" placeholder="Student Number" value={studentNumber} onChange={e => setStudentNumber(e.target.value)} className="w-full border rounded p-2" />
          <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border rounded p-2" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded p-2" />
          <input type="text" placeholder="Course" value={course} onChange={e => setCourse(e.target.value)} className="w-full border rounded p-2" />
          <input type="number" placeholder="Year Level" value={yearLevel} onChange={e => setYearLevel(Number(e.target.value))} className="w-full border rounded p-2" />
          <Button onClick={handleSendRequest} className="w-full bg-blue-600 text-white mt-2">Send Request</Button>
        </CardContent>
      </Card>

      {/* Show your requests */}
      {requests.length > 0 && (
        <Card>
          <CardContent>
            <h2 className="font-bold mb-2">Your Requests</h2>
            <ul className="space-y-1">
              {requests.map(r => (
                <li key={r.requestId}>
                  <strong>{r.full_name}</strong> ({r.student_number}) - <span className={r.status === 'Approved' ? 'text-green-600' : r.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}>{r.status}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
