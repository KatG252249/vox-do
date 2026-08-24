'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import DashboardView from '@/components/views/DashboardView';
import JournalView from '@/components/views/JournalView';
import ActionsView from '@/components/views/ActionsView';
import ArtifactsView from '@/components/views/ArtifactsView';

export type ViewType = 'dashboard' | 'journal' | 'actions' | 'artifacts';

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'HIGH' | 'NORMAL' | 'ROUTINE';
  status: 'QUEUE' | 'PROCESSING' | 'ARCHIVE';
  due: string;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Finalize Packet Tracer Lab', category: 'Networking', priority: 'HIGH', status: 'QUEUE', due: 'Today' },
  { id: '2', title: 'Prepare HCI Presentation Deck', category: 'HCI', priority: 'NORMAL', status: 'QUEUE', due: 'Tomorrow' },
  { id: '3', title: 'Synthesize Audio Logs & Notes', category: 'General', priority: 'HIGH', status: 'PROCESSING', due: 'In Progress' },
  { id: '4', title: 'Backend & Firestore Verification', category: 'System', priority: 'ROUTINE', status: 'ARCHIVE', due: 'Completed' },
];

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  return (
    <main className={`min-h-screen font-mono transition-colors duration-200 ${
      darkMode ? 'bg-stars-dark text-[#d1ffd7]' : 'bg-grid-light text-gray-900'
    }`}>
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {currentView === 'dashboard' && (
          <DashboardView 
            onNavigate={setCurrentView} 
            darkMode={darkMode} 
            tasks={tasks}
          />
        )}
        {currentView === 'journal' && (
          <JournalView 
            onBack={() => setCurrentView('dashboard')} 
            darkMode={darkMode} 
          />
        )}
        {currentView === 'actions' && (
          <ActionsView 
            onBack={() => setCurrentView('dashboard')} 
            darkMode={darkMode}
            tasks={tasks}
            setTasks={setTasks}
          />
        )}
        {currentView === 'artifacts' && (
          <ArtifactsView 
            onBack={() => setCurrentView('dashboard')} 
            darkMode={darkMode} 
          />
        )}
      </div>
    </main>
  );
}