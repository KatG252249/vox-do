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
  calendar_url?: string;
}

export interface JournalEntry {
  id: number;
  date: string;
  year: string;
  month: string;
  day: string;
  title: string;
  tone: string;
  summary: string;
  tags: string[];
}

export interface ArtifactItem {
  id: number;
  type: string;
  name: string;
  course: string;
  date: string;
  action: string;
  url?: string;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Finalize Packet Tracer Lab', category: 'Networking', priority: 'HIGH', status: 'QUEUE', due: 'Today' },
];

const initialJournal: JournalEntry[] = [
  {
    id: 1,
    date: '2026-08-24',
    year: '2026',
    month: '08',
    day: '24',
    title: 'Frontend Command Center Refinements',
    tone: 'Focused / Productive',
    summary: 'Configured audio ingestion with FastAPI and wired live state updates for real-time task extraction.',
    tags: ['frontend', 'fastapi', 'gemini']
  }
];

const initialArtifacts: ArtifactItem[] = [
  { id: 1, type: 'SHEET', name: 'IT_Sem1_Grades.sheet', course: 'General', date: '2026-08-24', action: 'open' },
];

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initialJournal);
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>(initialArtifacts);

  // --- DELETE HANDLERS ---
  const handleDeleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
  const handleDeleteJournal = (id: number) => setJournalEntries(prev => prev.filter(j => j.id !== id));
  const handleDeleteArtifact = (id: number) => setArtifacts(prev => prev.filter(a => a.id !== id));

  const handleNewProcessedData = (data: { journal?: any; tasks?: Task[]; artifact?: any }) => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const yearStr = today.getFullYear().toString();
    const monthStr = String(today.getMonth() + 1).padStart(2, '0');
    const dayStr = String(today.getDate()).padStart(2, '0');

    if (data.journal && data.journal.title && data.journal.summary) {
      const newEntry: JournalEntry = {
        id: Date.now(),
        date: dateStr,
        year: yearStr,
        month: monthStr,
        day: dayStr,
        title: data.journal.title,
        tone: data.journal.tone || "Productive",
        summary: data.journal.summary,
        tags: data.journal.tags || ["voice-log"]
      };
      setJournalEntries(prev => [newEntry, ...prev]);
    }

    if (data.tasks && Array.isArray(data.tasks) && data.tasks.length > 0) {
      const newTasks: Task[] = data.tasks.map((t: any, idx: number) => ({
        id: `${Date.now()}-${idx}`,
        title: t.title || "New Voice Task",
        category: t.category || "General",
        priority: t.priority || "NORMAL",
        status: "QUEUE",
        due: t.due || "This Week",
        calendar_url: t.calendar_url 
      }));
      setTasks(prev => [...newTasks, ...prev]);
    }

    if (data.artifact && data.artifact.name && data.artifact.type) {
      const newArtifact: ArtifactItem = {
        id: Date.now(),
        type: data.artifact.type,
        name: data.artifact.name,
        course: data.artifact.course || "General",
        date: dateStr,
        action: 'open',
        url: data.artifact.url  
      };
      setArtifacts(prev => [newArtifact, ...prev]);
    }
  };

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
            journalEntries={journalEntries}
            artifacts={artifacts}
            onNewProcessedData={handleNewProcessedData}
          />
        )}
        {currentView === 'journal' && (
          <JournalView 
            onBack={() => setCurrentView('dashboard')} 
            darkMode={darkMode}
            entries={journalEntries}
            onDelete={handleDeleteJournal}
          />
        )}
        {currentView === 'actions' && (
          <ActionsView 
            onBack={() => setCurrentView('dashboard')} 
            darkMode={darkMode}
            tasks={tasks}
            setTasks={setTasks}
            onDelete={handleDeleteTask}
          />
        )}
        {currentView === 'artifacts' && (
          <ArtifactsView 
            onBack={() => setCurrentView('dashboard')} 
            darkMode={darkMode} 
            artifacts={artifacts}
            onDelete={handleDeleteArtifact}
          />
        )}
      </div>
    </main>
  );
}