'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, Trash2 } from 'lucide-react';
import { JournalEntry } from '@/app/page';

interface JournalViewProps {
  onBack: () => void;
  darkMode: boolean;
  entries: JournalEntry[];
  onDelete: (id: number) => void;
}

const MONTH_NAMES: Record<string, string> = {
  '01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': 'May', '06': 'June',
  '07': 'July', '08': 'August', '09': 'September', '10': 'October', '11': 'November', '12': 'December'
};

export default function JournalView({ onBack, darkMode, entries, onDelete }: JournalViewProps) {
  const [selectedId, setSelectedId] = useState<number | null>(entries.length > 0 ? entries[0].id : null);
  const [filterYear, setFilterYear] = useState('ALL');
  const [filterMonth, setFilterMonth] = useState('ALL');
  const [filterDay, setFilterDay] = useState('ALL');
  const [searchTag, setSearchTag] = useState('');

  // Dynamic dropdown options from actual entry data
  const availableYears = Array.from(new Set(entries.map(e => e.year))).sort().reverse();
  const availableMonths = Array.from(new Set(entries.map(e => e.month))).sort();
  const availableDays = Array.from(new Set(entries.map(e => e.day))).sort();

  const filteredLogs = entries.filter(log => {
    const matchYear = filterYear === 'ALL' || log.year === filterYear;
    const matchMonth = filterMonth === 'ALL' || log.month === filterMonth;
    const matchDay = filterDay === 'ALL' || log.day === filterDay;
    const matchSearch = searchTag === '' || 
      log.tags.some(t => t.toLowerCase().includes(searchTag.toLowerCase())) ||
      log.title.toLowerCase().includes(searchTag.toLowerCase());
    return matchYear && matchMonth && matchDay && matchSearch;
  });

  // Ensure active log remains valid after deletion
  let activeLog = filteredLogs.find(l => l.id === selectedId);
  if (!activeLog && filteredLogs.length > 0) {
    activeLog = filteredLogs[0];
  }

  const handleDelete = (id: number) => {
    onDelete(id);
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="space-y-4">
      {/* Navigation & Controls */}
      <div className={`flex flex-col gap-3 pb-3 border-b ${darkMode ? 'border-[#1f3a2c]' : 'border-emerald-200'}`}>
        <button 
          onClick={onBack}
          className={`flex items-center gap-2 text-xs font-bold uppercase cursor-pointer self-start ${
            darkMode ? 'text-[#00ff41] hover:underline' : 'text-emerald-800 hover:underline'
          }`}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 text-xs w-full">
        {/* Year Filter */}
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className={`border px-2 py-1.5 text-xs outline-none ${
            darkMode ? 'border-[#1f3a2c] bg-[#0a0f0d] text-[#d1ffd7]' : 'border-emerald-200 bg-white text-gray-900'
          }`}
        >
          <option value="ALL">All Years</option>
          {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        {/* Month Filter */}
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className={`border px-2 py-1.5 text-xs outline-none ${
            darkMode ? 'border-[#1f3a2c] bg-[#0a0f0d] text-[#d1ffd7]' : 'border-emerald-200 bg-white text-gray-900'
        }`}
        >
          <option value="ALL">All Months</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>{MONTH_NAMES[m] || m}</option>
            ))}
        </select>

          {/* Day Filter */}
          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className={`border px-2 py-1.5 text-xs outline-none ${
              darkMode ? 'border-[#1f3a2c] bg-[#0a0f0d] text-[#d1ffd7]' : 'border-emerald-200 bg-white text-gray-900'
          }`}
        >
          <option value="ALL">All Days</option>
          {availableDays.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

          {/* Existing Search Box */}
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
      </div>.

      {/* Split-Pane Feed */}
      <div className={`grid grid-cols-1 md:grid-cols-12 border min-h-[480px] ${darkMode ? 'border-[#1f3a2c]' : 'border-emerald-200'}`}>
        {/* Left: Index */}
        <div className={`md:col-span-5 border-b md:border-b-0 md:border-r overflow-y-auto max-h-[300px] md:max-h-[520px] ${
          darkMode ? 'border-[#1f3a2c] bg-[#0a0f0d]' : 'border-emerald-200 bg-emerald-50/50'
        }`}>
          {filteredLogs.length === 0 ? (
             <div className="p-4 text-xs text-gray-500">No journal entries found.</div>
          ) : (
            filteredLogs.map(log => (
              <div
                key={log.id}
                onClick={() => setSelectedId(log.id)}
                className={`p-3 sm:p-4 border-b cursor-pointer transition-colors flex flex-col relative group ${
                  darkMode 
                    ? (activeLog?.id === log.id ? 'bg-[#0d1411] border-l-4 border-l-[#00ff41] border-[#1f3a2c]' : 'border-[#1f3a2c] hover:bg-[#080c0a]')
                    : (activeLog?.id === log.id ? 'bg-white border-l-4 border-l-emerald-600 border-emerald-200 shadow-sm' : 'border-emerald-100 hover:bg-emerald-100/50')
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
                <h4 className={`text-xs font-bold mb-0.5 pr-6 ${darkMode ? 'text-white' : 'text-emerald-950'}`}>{log.title}</h4>
                <p className={`text-[11px] font-sans line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{log.summary}</p>
                
                {/* Delete Button (Visible on Hover/Active) */}
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(log.id); }}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-md ${
                    darkMode ? 'text-red-500 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'
                  }`}
                  title="Delete Entry"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right: Reading View */}
        {activeLog ? (
          <div className={`md:col-span-7 p-4 sm:p-6 flex flex-col justify-between gap-4 ${darkMode ? 'bg-[#080c0a]' : 'bg-white'}`}>
            <div className="space-y-3 sm:space-y-4">
              <div className={`border-b pb-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 ${darkMode ? 'border-[#1f3a2c]' : 'border-emerald-100'}`}>
                <div>
                  <div className={`text-[10px] uppercase ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{activeLog.date}</div>
                  <h3 className={`text-sm sm:text-base font-bold uppercase mt-0.5 ${darkMode ? 'text-white' : 'text-emerald-950'}`}>{activeLog.title}</h3>
                </div>
                <span className={`text-xs font-bold self-start ${darkMode ? 'text-[#00ff41]' : 'text-emerald-700'}`}>
                  {activeLog.tone}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className={`text-[10px] uppercase font-bold ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Transcription Summary</div>
                <p className={`text-xs font-sans leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {activeLog.summary}
                </p>
              </div>
            </div>

            <div className={`pt-3 border-t flex items-center gap-1.5 flex-wrap ${darkMode ? 'border-[#1f3a2c]' : 'border-emerald-100'}`}>
              <span className={`text-[10px] font-bold uppercase mr-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Tags:</span>
              {activeLog.tags.map(tag => (
                <span key={tag} className={`border px-2 py-0.5 text-[10px] ${darkMode ? 'border-[#1f3a2c] text-[#00ff41]' : 'border-emerald-200 text-emerald-800 bg-emerald-50'}`}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className={`md:col-span-7 p-4 sm:p-6 flex items-center justify-center ${darkMode ? 'bg-[#080c0a]' : 'bg-white'}`}>
             <p className="text-xs text-gray-500">Select an entry to read.</p>
          </div>
        )}
      </div>
    </div>
  );
}