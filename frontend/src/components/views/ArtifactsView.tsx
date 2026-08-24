'use client';

import React, { useState } from 'react';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';

const mockArtifacts = [
  { id: 1, type: 'PPTX', name: 'Abstraction_in_OOP.pptx', course: 'OOP', date: '2026-08-22', action: 'download' },
  { id: 2, type: 'SHEET', name: 'IT_Sem1_Grades.sheet', course: 'General', date: '2026-08-20', action: 'open' },
  { id: 3, type: 'DOC', name: 'Network_Segmentation.docx', course: 'Networking', date: '2026-05-15', action: 'open' },
  { id: 4, type: 'FORM', name: 'HCI_Midterm_Survey.form', course: 'HCI', date: '2026-08-19', action: 'open' },
];

export default function ArtifactsView({ onBack, darkMode }: { onBack: () => void; darkMode: boolean }) {
  const [selectedType, setSelectedType] = useState('ALL');

  const filtered = selectedType === 'ALL' 
    ? mockArtifacts 
    : mockArtifacts.filter(a => a.type === selectedType);

  return (
    <div className="space-y-4">
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b ${
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

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'PPTX', 'SHEET', 'DOC', 'FORM'].map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`border px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                selectedType === t 
                  ? darkMode 
                    ? 'border-[#00ff41] bg-[#00ff41] text-black' 
                    : 'border-emerald-600 bg-emerald-600 text-white'
                  : darkMode 
                    ? 'border-[#1f3a2c] text-gray-400 hover:text-white' 
                    : 'border-emerald-200 text-emerald-800 bg-white hover:bg-emerald-50'
              }`}
            >
              .{t}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className={`border overflow-x-auto transition-colors ${
        darkMode ? 'border-[#1f3a2c] bg-[#0a0f0d]' : 'border-emerald-200 bg-white shadow-sm'
      }`}>
        <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-full">
          <thead>
            <tr className={`border-b text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
              darkMode ? 'border-[#1f3a2c] bg-[#0d1411] text-[#00ff41]' : 'border-emerald-200 bg-emerald-50 text-emerald-900'
            }`}>
              <th className="p-3">Type</th>
              <th className="p-3">Filename</th>
              <th className="p-3">Course</th>
              <th className="p-3">Created</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs ${darkMode ? 'divide-[#1f3a2c]' : 'divide-emerald-100'}`}>
            {filtered.map(item => (
              <tr key={item.id} className={darkMode ? 'hover:bg-[#080c0a]' : 'hover:bg-emerald-50/50'}>
                <td className={`p-3 font-bold text-[10px] sm:text-xs ${darkMode ? 'text-[#00ff41]' : 'text-emerald-700'}`}>
                  [{item.type}]
                </td>
                <td className={`p-3 font-sans truncate max-w-[150px] sm:max-w-none font-medium ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {item.name}
                </td>
                <td className={`p-3 text-[10px] sm:text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.course}</td>
                <td className={`p-3 text-[10px] sm:text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.date}</td>
                <td className="p-3 text-right">
                  {item.action === 'download' ? (
                    <button className={`border px-3 py-1 text-[9px] sm:text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                      darkMode 
                        ? 'border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black' 
                        : 'border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                    }`}>
                      <Download size={10} /> DL
                    </button>
                  ) : (
                    <button className={`border px-3 py-1 text-[9px] sm:text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                      darkMode 
                        ? 'border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black' 
                        : 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}>
                      <ExternalLink size={10} /> OPEN
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}