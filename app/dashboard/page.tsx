"use client";

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dashboard() {
  const [userData, setUserData] = useState({ name: 'User' });
  const [stats, setStats] = useState({
    projects: 5,
    tasks: 23,
    completedTasks: 17,
    teamMembers: 8
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-300 mt-2">Welcome back, {userData?.name}!</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Projects</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.projects}</p>
                </div>
                <div className="bg-gradient-to-r from-[#ff9800]/20 to-[#ff5722]/20 p-3 rounded-full">
                  <svg className="w-6 h-6 text-[#ff9800]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <a href="#" className="text-sm font-medium text-[#ff9800] hover:text-[#ff5722]">View all projects</a>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Tasks</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.tasks}</p>
                </div>
                <div className="bg-gradient-to-r from-[#ff9800]/20 to-[#ff5722]/20 p-3 rounded-full">
                  <svg className="w-6 h-6 text-[#ff5722]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-300">{stats.completedTasks} completed</span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span className="text-sm text-gray-300">{stats.tasks - stats.completedTasks} pending</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Team Members</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.teamMembers}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <a href="#" className="text-sm font-medium text-white hover:text-gray-300">Manage team</a>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Completion Rate</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stats.tasks > 0 ? Math.round((stats.completedTasks / stats.tasks) * 100) : 0}%
                  </p>
                </div>
                <div className="bg-gradient-to-r from-[#ff9800]/20 to-[#ff5722]/20 p-3 rounded-full">
                  <svg className="w-6 h-6 text-[#ff9800]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-[#ff9800] to-[#ff5722] h-2.5 rounded-full" 
                    style={{ width: `${stats.tasks > 0 ? Math.round((stats.completedTasks / stats.tasks) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-medium text-white">Recent Activity</h2>
            </div>
            <div className="divide-y divide-white/10">
              {[
                { id: 1, user: 'You', action: 'completed task', target: 'Update dashboard UI', time: '2 hours ago' },
                { id: 2, user: 'Sarah', action: 'commented on', target: 'Project roadmap', time: '4 hours ago' },
                { id: 3, user: 'Mike', action: 'assigned you', target: 'API integration task', time: 'Yesterday' },
                { id: 4, user: 'Anna', action: 'joined project', target: 'Website redesign', time: '2 days ago' },
                { id: 5, user: 'You', action: 'created project', target: 'Mobile app development', time: '3 days ago' },
              ].map((item) => (
                <div key={item.id} className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff9800] to-[#ff5722] flex items-center justify-center text-white font-medium">
                        {item.user.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-white">
                        <span className="font-medium">{item.user}</span> {item.action} <span className="font-medium">{item.target}</span>
                      </p>
                      <p className="text-xs text-gray-400">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-white/5">
              <a href="#" className="text-sm font-medium text-[#ff9800] hover:text-[#ff5722]">View all activity</a>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a href="#" className="block px-4 py-2 bg-gradient-to-r from-[#ff9800]/10 to-[#ff5722]/10 hover:from-[#ff9800]/20 hover:to-[#ff5722]/20 rounded-md text-sm font-medium text-white">Create new project</a>
                <a href="#" className="block px-4 py-2 bg-gradient-to-r from-[#ff9800]/10 to-[#ff5722]/10 hover:from-[#ff9800]/20 hover:to-[#ff5722]/20 rounded-md text-sm font-medium text-white">Add team member</a>
                <a href="#" className="block px-4 py-2 bg-gradient-to-r from-[#ff9800]/10 to-[#ff5722]/10 hover:from-[#ff9800]/20 hover:to-[#ff5722]/20 rounded-md text-sm font-medium text-white">Schedule meeting</a>
                <a href="#" className="block px-4 py-2 bg-gradient-to-r from-[#ff9800]/10 to-[#ff5722]/10 hover:from-[#ff9800]/20 hover:to-[#ff5722]/20 rounded-md text-sm font-medium text-white">Create task</a>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow p-6 md:col-span-2">
              <h3 className="text-lg font-medium text-white mb-4">Upcoming Deadlines</h3>
              <div className="space-y-4">
                {[
                  { id: 1, task: 'Complete dashboard design', project: 'Website Redesign', dueDate: 'Tomorrow', status: 'urgent' },
                  { id: 2, task: 'Review marketing materials', project: 'Product Launch', dueDate: 'In 3 days', status: 'normal' },
                  { id: 3, task: 'Finalize API documentation', project: 'Mobile App', dueDate: 'Next week', status: 'normal' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{item.task}</p>
                      <p className="text-sm text-gray-300">{item.project}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'urgent' 
                          ? 'bg-gradient-to-r from-[#ff5722]/20 to-[#ff9800]/20 text-[#ff9800]' 
                          : 'bg-white/20 text-white'
                      }`}>
                        {item.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}