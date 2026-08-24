'use client';

import React, { useState } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { Task } from '@/app/page';

interface ActionsViewProps {
  onBack: () => void;
  darkMode: boolean;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function ActionsView({ onBack, darkMode, tasks, setTasks }: ActionsViewProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDrop = (newStatus: 'QUEUE' | 'PROCESSING' | 'ARCHIVE') => {
    if (!draggedId) return;
    setTasks(prev => prev.map(t => t.id === draggedId ? { ...t, status: newStatus } : t));
    setDraggedId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const moveTaskMobile = (id: string, nextStatus: 'QUEUE' | 'PROCESSING' | 'ARCHIVE') => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));
  };

  const renderColumn = (status: 'QUEUE' | 'PROCESSING' | 'ARCHIVE', title: string, darkColor: string, lightColor: string) => {
    const colTasks = tasks.filter(t => t.status === status);

    return (
      <div 
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(status)}
        className={`border p-3 sm:p-4 flex flex-col gap-2.5 min-h-[350px] sm:min-h-[460px] transition-colors ${
          darkMode 
            ? 'border-[#1f3a2c] bg-[#0a0f0d]' 
            : 'border-emerald-200 bg-emerald-50/60 shadow-sm'
        }`}
      >
        <div className={`border-b-2 pb-1.5 text-xs font-bold uppercase flex justify-between ${
          darkMode ? darkColor : lightColor
        }`}>
          <span>{title} [{colTasks.length}]</span>
        </div>

        <div className="space-y-2.5 flex-grow">
          {colTasks.map(task => (
            <div
              key={task.id}
              draggable
              onDragStart={() => handleDragStart(task.id)}
              className={`border p-3.5 space-y-2 cursor-grab active:cursor-grabbing transition-all ${
                darkMode 
                  ? 'border-[#1f3a2c] bg-[#0d1411] hover:border-[#00ff41]' 
                  : 'border-emerald-200 bg-white hover:border-emerald-600 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-center text-[9px] font-bold">
                <span className={task.priority === 'HIGH' ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-emerald-700'}>
                  {task.priority}
                </span>
                <span className={darkMode ? 'text-gray-500 uppercase' : 'text-gray-400 uppercase'}>{task.category}</span>
              </div>

              <div className={`text-xs font-sans font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {task.title}
              </div>
              
              <div className="flex justify-between items-center pt-1">
                <div className={`text-[10px] flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  <Clock size={10} /> {task.due}
                </div>

                <div className="flex sm:hidden gap-1 text-[9px]">
                  {status !== 'QUEUE' && (
                    <button 
                      onClick={() => moveTaskMobile(task.id, 'QUEUE')}
                      className={`px-1.5 py-0.5 border ${darkMode ? 'border-[#1f3a2c] text-gray-400' : 'border-gray-300 text-gray-700'}`}
                    >
                      ←
                    </button>
                  )}
                  {status !== 'PROCESSING' && (
                    <button 
                      onClick={() => moveTaskMobile(task.id, 'PROCESSING')}
                      className={`px-1.5 py-0.5 border font-bold ${darkMode ? 'border-[#00ff41] text-[#00ff41]' : 'border-emerald-600 text-emerald-700'}`}
                    >
                      PROG
                    </button>
                  )}
                  {status !== 'ARCHIVE' && (
                    <button 
                      onClick={() => moveTaskMobile(task.id, 'ARCHIVE')}
                      className={`px-1.5 py-0.5 border ${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-700'}`}
                    >
                      ✓
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className={`flex items-center pb-2 border-b ${
        darkMode ? 'border-[#1f3a2c]' : 'border-emerald-200'
      }`}>
        <button 
          onClick={onBack}
          className={`flex items-center gap-2 text-xs font-bold uppercase cursor-pointer ${
            darkMode ? 'text-[#00ff41] hover:underline' : 'text-emerald-800 hover:underline'
          }`}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderColumn('QUEUE', 'Queue', 'border-gray-500 text-gray-400', 'border-emerald-700 text-emerald-900')}
        {renderColumn('PROCESSING', 'In Progress', 'border-[#00ff41] text-[#00ff41]', 'border-emerald-500 text-emerald-700')}
        {renderColumn('ARCHIVE', 'Completed', 'border-gray-700 text-gray-600', 'border-gray-400 text-gray-600')}
      </div>
    </div>
  );
}