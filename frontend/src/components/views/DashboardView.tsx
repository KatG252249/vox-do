'use client';

import React, { useState } from 'react';
import { Mic, CheckCircle2, Clock } from 'lucide-react';
import { ViewType, Task } from '@/app/page';

interface DashboardViewProps {
  onNavigate: (v: ViewType) => void;
  darkMode: boolean;
  tasks: Task[];
}

export default function DashboardView({ onNavigate, darkMode, tasks }: DashboardViewProps) {
  const [isRecording, setIsRecording] = useState(false);

  // Derive live pending count and the top uncompleted task
  const pendingTasks = tasks.filter(t => t.status === 'QUEUE' || t.status === 'PROCESSING');
  const topTask = pendingTasks.find(t => t.priority === 'HIGH') || pendingTasks[0];

  const cardBtnStyle = `w-full mt-4 py-2.5 text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
    darkMode 
      ? 'border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black' 
      : 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
  }`;

  return (
    <div className="space-y-6 pt-2">
      {/* Radar Mic Hero */}
      <div className={`border p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden transition-colors ${
        darkMode ? 'border-[#1f3a2c] bg-[#0a0f0d]/80' : 'border-emerald-200 bg-white/90 shadow-sm'
      }`}>
        <div className="relative flex items-center justify-center mb-6 my-2">
          {/* Pulsing Concentric Rings */}
          <div className={`absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-dashed transition-all ${
            isRecording ? 'border-[#00ff41] animate-mic-pulse' : darkMode ? 'border-[#1f3a2c]' : 'border-emerald-200'
          }`}></div>
          <div className={`absolute w-24 h-24 sm:w-30 sm:h-30 rounded-full border ${
            isRecording ? 'border-[#00ff41]/60' : darkMode ? 'border-[#1f3a2c]/60' : 'border-emerald-200/80'
          }`}></div>

          {/* Central Mic Button */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer active:scale-95 ${
              isRecording 
                ? 'bg-[#00ff41] border-[#00ff41] text-black shadow-lg shadow-[#00ff41]/40' 
                : darkMode 
                  ? 'bg-transparent border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black' 
                  : 'bg-emerald-50 border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white'
            }`}
          >
            <Mic size={26} className="sm:w-8 sm:h-8" />
          </button>
        </div>

        <h2 className={`text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-1 text-center ${
          darkMode ? 'text-white' : 'text-emerald-950'
        }`}>
          {isRecording ? 'LISTENING & STREAMING...' : 'VOICE STREAM READY'}
        </h2>
        <p className={`text-[11px] font-sans text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {isRecording ? 'Awaiting acoustic pause to dispatch' : 'Tap mic to initiate audio capture'}
        </p>
      </div>

      {/* 3 Core Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* 1. Live Journal */}
        <div 
          onClick={() => onNavigate('journal')}
          className={`border p-5 cursor-pointer flex flex-col justify-between transition-all ${
            darkMode 
              ? 'border-[#1f3a2c] bg-[#0a0f0d] hover:border-[#00ff41]' 
              : 'border-emerald-200 bg-white hover:border-emerald-600 shadow-sm'
          }`}
        >
          <div>
            <div className={`flex justify-between items-center mb-3 border-b pb-2 ${
              darkMode ? 'border-[#1f3a2c]' : 'border-emerald-100'
            }`}>
              <span className={`text-xs font-bold uppercase ${darkMode ? 'text-white' : 'text-emerald-950'}`}>
                ■ Live Journal
              </span>
              <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">REC</span>
            </div>
            <div className="space-y-2">
              <div className={`border-l-2 pl-2.5 py-1 ${darkMode ? 'border-[#00ff41]' : 'border-emerald-600 bg-emerald-50/50'}`}>
                <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>10:42 AM</span>
                <p className={`text-xs font-sans line-clamp-2 mt-0.5 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                  Completed backend verification and initialized frontend views.
                </p>
              </div>
            </div>
          </div>
          <button className={cardBtnStyle}>
            View Full Archive
          </button>
        </div>

        {/* 2. Active Tasks (Live Synced) */}
        <div 
          onClick={() => onNavigate('actions')}
          className={`border p-5 cursor-pointer flex flex-col justify-between transition-all ${
            darkMode 
              ? 'border-[#1f3a2c] bg-[#0a0f0d] hover:border-[#00ff41]' 
              : 'border-emerald-200 bg-white hover:border-emerald-600 shadow-sm'
          }`}
        >
          <div>
            <div className={`flex justify-between items-center mb-3 border-b pb-2 ${
              darkMode ? 'border-[#1f3a2c]' : 'border-emerald-100'
            }`}>
              <span className={`text-xs font-bold uppercase ${darkMode ? 'text-white' : 'text-emerald-950'}`}>
                ■ Active Tasks
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 border uppercase font-bold ${
                pendingTasks.length > 0
                  ? darkMode 
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' 
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                  : darkMode
                    ? 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/40'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                {pendingTasks.length > 0 ? `${pendingTasks.length} Pending` : 'All Done'}
              </span>
            </div>
            
            {topTask ? (
              <div className={`p-3 border transition-colors ${
                darkMode ? 'border-[#1f3a2c] bg-[#0d1411]' : 'border-emerald-200 bg-emerald-50/60'
              }`}>
                <div className={`text-[10px] font-bold uppercase ${
                  topTask.priority === 'HIGH' ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-emerald-700'
                }`}>
                  {topTask.priority} Priority
                </div>
                <div className={`text-xs font-sans font-medium mt-0.5 truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {topTask.title}
                </div>
                <div className={`text-[10px] flex items-center gap-1 mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  <Clock size={10} /> Due {topTask.due}
                </div>
              </div>
            ) : (
              <div className={`p-3 border text-center text-xs ${
                darkMode ? 'border-[#1f3a2c] bg-[#0d1411] text-[#00ff41]' : 'border-emerald-200 bg-emerald-50/60 text-emerald-800'
              }`}>
                ✓ No active tasks in queue.
              </div>
            )}
          </div>
          <button className={cardBtnStyle}>
            Open Task Board
          </button>
        </div>

        {/* 3. Workspace Files */}
        <div 
          onClick={() => onNavigate('artifacts')}
          className={`border p-5 cursor-pointer flex flex-col justify-between transition-all ${
            darkMode 
              ? 'border-[#1f3a2c] bg-[#0a0f0d] hover:border-[#00ff41]' 
              : 'border-emerald-200 bg-white hover:border-emerald-600 shadow-sm'
          }`}
        >
          <div>
            <div className={`flex justify-between items-center mb-3 border-b pb-2 ${
              darkMode ? 'border-[#1f3a2c]' : 'border-emerald-100'
            }`}>
              <span className={`text-xs font-bold uppercase ${darkMode ? 'text-white' : 'text-emerald-950'}`}>
                ■ Workspace Files
              </span>
              <span className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-emerald-800 font-semibold'}`}>
                Drive Synced
              </span>
            </div>
            
            <div className={`p-2.5 border flex justify-between items-center ${
              darkMode ? 'border-[#1f3a2c] bg-[#0d1411]' : 'border-emerald-200 bg-emerald-50/60'
            }`}>
              <div>
                <div className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  IT_Sem1_Grades.sheet
                </div>
                <div className={`text-[10px] uppercase font-bold ${darkMode ? 'text-[#00ff41]' : 'text-emerald-700'}`}>
                  Google Sheet
                </div>
              </div>
              <CheckCircle2 size={15} className={darkMode ? 'text-[#00ff41]' : 'text-emerald-600'} />
            </div>
          </div>
          <button className={cardBtnStyle}>
            Access Database
          </button>
        </div>

      </div>
    </div>
  );
}