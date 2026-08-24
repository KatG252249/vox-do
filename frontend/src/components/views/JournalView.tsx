'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar } from 'lucide-react';

const mockLogs = [
  {
    id: 1,
    date: '2026-08-24',
    year: '2026',
    month: '08',
    day: '24',
    title: 'Frontend Command Center Refinements',
    tone: 'Focused / Productive',
    summary: 'Iterated on the command-center UI aesthetic, replaced placeholder wording with proper workspace telemetry, and configured date-based filtering for past logs.',
    tags: ['frontend', 'ui-ux', 'nextjs']
  },
  {
    id: 2,
    date: '2026-08-22',
    year: '2026',
    month: '08',
    day: '22',
    title: 'Backend Pipeline & Firestore Verification',
    tone: 'Accomplished',
    summary: 'Successfully connected the audio processing endpoint with Gemini and confirmed real-time document commits inside Firestore database collections.',
    tags: ['backend', 'firestore', 'fastapi']
  },
  {
    id: 3,
    date: '2026-05-15',
    year: '2026',
    month: '05',
    day: '15',
    title: 'Switch Virtual Interfaces & VLAN Config',
    tone: 'Analytical',
    summary: 'Practiced switch segmentation and SVI configurations for inter-VLAN routing assignments.',
    tags: ['networking', 'cisco', 'packet-tracer']
  }
];

export default function JournalView({ onBack, darkMode }: { onBack: () => void; darkMode: boolean }) {
  const [selectedId, setSelectedId] = useState(1);
  const [filterYear, setFilterYear] = useState('ALL');
  const [filterMonth, setFilterMonth] = useState('ALL');
  const [searchTag, setSearchTag] = useState('');

  const filteredLogs = mockLogs.filter(log => {
    const matchYear = filterYear === 'ALL' || log.year === filterYear;
    const matchMonth = filterMonth === 'ALL' || log.month === filterMonth;
    const matchSearch = searchTag === '' || 
      log.tags.some(t => t.toLowerCase().includes(searchTag.toLowerCase())) ||
      log.title.toLowerCase().includes(searchTag.toLowerCase());
    return matchYear && matchMonth && matchSearch;
  });

  const activeLog = filteredLogs.find(l => l.id === selectedId) || filteredLogs[0] || mockLogs[0];

  return (
    <div className="space-y-4">
      {/* Navigation & Controls */}
      <div className={`flex flex-col gap-3 pb-3 border-b ${
        darkMode ? 'border-[#1f3a2c]' : 'border-emerald-200'
      }`}>
        <button 
          onClick={onBack}
          className={`flex items-center gap-2 text-xs font-bold uppercase cursor-pointer self-start ${
            darkMode ? 'text-[#00ff41] hover:underline' : 'text-emerald-800 hover:underline'
          }`}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 text-xs w-full">
          <div className={`flex items-center border px-2 py-1.5 ${
            darkMode ? 'border-[#1f3a2c] bg-[#0a0f0d]' : 'border-emerald-200 bg-white'
          }`}>
            <Calendar size={12} className="text-gray-500 mr-1.5" />
            <select 
              value={filterYear} 
              onChange={(e) => setFilterYear(e.target.value)}
              className={`bg-transparent outline-none uppercase text-[11px] w-full ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
            >
              <option value="ALL">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div className={`flex items-center border px-2 py-1.5 ${
            darkMode ? 'border-[#1f3a2c] bg-[#0a0f0d]' : 'border-emerald-200 bg-white'
          }`}>
            <select 
              value={filterMonth} 
              onChange={(e) => setFilterMonth(e.target.value)}
              className={`bg-transparent outline-none uppercase text-[11px] w-full ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
            >
              <option value="ALL">All Months</option>
              <option value="08">August</option>
              <option value="05">May</option>
            </select>
          </div>

          <div className={`col-span-2 sm:flex-1 flex items-center border px-2 py-1.5 ${
            darkMode ? 'border-[#1f3a2c] bg-[#0a0f0d]' : 'border-emerald-200 bg-white'
          }`}>
            <Search size={12} className="text-gray-500 mr-1.5" />
            <input 
              type="text"
              placeholder="Search tag..."
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              className={`bg-transparent outline-none text-xs w-full ${
                darkMode ? 'text-[#d1ffd7]' : 'text-gray-900 placeholder:text-gray-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Split-Pane Feed */}
      <div className={`grid grid-cols-1 md:grid-cols-12 border min-h-[480px] ${
        darkMode ? 'border-[#1f3a2c]' : 'border-emerald-200'
      }`}>
        {/* Left: Index */}
        <div className={`md:col-span-5 border-b md:border-b-0 md:border-r overflow-y-auto max-h-[300px] md:max-h-[520px] ${
          darkMode ? 'border-[#1f3a2c] bg-[#0a0f0d]' : 'border-emerald-200 bg-emerald-50/50'
        }`}>
          {filteredLogs.map(log => (
            <div
              key={log.id}
              onClick={() => setSelectedId(log.id)}
              className={`p-3 sm:p-4 border-b cursor-pointer transition-colors ${
                darkMode 
                  ? selectedId === log.id 
                    ? 'bg-[#0d1411] border-l-4 border-l-[#00ff41] border-[#1f3a2c]' 
                    : 'border-[#1f3a2c] hover:bg-[#080c0a]'
                  : selectedId === log.id 
                    ? 'bg-white border-l-4 border-l-emerald-600 border-emerald-200 shadow-sm' 
                    : 'border-emerald-100 hover:bg-emerald-100/50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[10px] font-mono ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>{log.date}</span>
                <span className={`text-[9px] px-1.5 py-0.5 uppercase font-bold border ${
                  darkMode ? 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/30' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {log.tone}
                </span>
              </div>
              <h4 className={`text-xs font-bold mb-0.5 ${darkMode ? 'text-white' : 'text-emerald-950'}`}>{log.title}</h4>
              <p className={`text-[11px] font-sans line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{log.summary}</p>
            </div>
          ))}
        </div>

        {/* Right: Reading View */}
        {activeLog && (
          <div className={`md:col-span-7 p-4 sm:p-6 flex flex-col justify-between gap-4 ${
            darkMode ? 'bg-[#080c0a]' : 'bg-white'
          }`}>
            <div className="space-y-3 sm:space-y-4">
              <div className={`border-b pb-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 ${
                darkMode ? 'border-[#1f3a2c]' : 'border-emerald-100'
              }`}>
                <div>
                  <div className={`text-[10px] uppercase ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{activeLog.date}</div>
                  <h3 className={`text-sm sm:text-base font-bold uppercase mt-0.5 ${
                    darkMode ? 'text-white' : 'text-emerald-950'
                  }`}>{activeLog.title}</h3>
                </div>
                <span className={`text-xs font-bold self-start ${darkMode ? 'text-[#00ff41]' : 'text-emerald-700'}`}>
                  {activeLog.tone}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className={`text-[10px] uppercase font-bold ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Transcription Summary
                </div>
                <p className={`text-xs font-sans leading-relaxed ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {activeLog.summary}
                </p>
              </div>
            </div>

            <div className={`pt-3 border-t flex items-center gap-1.5 flex-wrap ${
              darkMode ? 'border-[#1f3a2c]' : 'border-emerald-100'
            }`}>
              <span className={`text-[10px] font-bold uppercase mr-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Tags:</span>
              {activeLog.tags.map(tag => (
                <span key={tag} className={`border px-2 py-0.5 text-[10px] ${
                  darkMode ? 'border-[#1f3a2c] text-[#00ff41]' : 'border-emerald-200 text-emerald-800 bg-emerald-50'
                }`}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}