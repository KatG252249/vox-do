'use client';

import React, { useState } from 'react';
import { Mic, CheckCircle2, Moon, Sun } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`min-h-screen font-mono transition-colors duration-200 ${
      darkMode ? 'bg-stars-dark text-[#d1ffd7]' : 'bg-grid-light text-gray-900'
    }`}>
      {/* Minimal Navbar for Login */}
      <nav className={`border-b ${darkMode ? 'border-[#1f3a2c] bg-[#0a0f0d]/90' : 'border-emerald-200 bg-white/90'} sticky top-0 z-50 backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={`text-lg font-black tracking-widest ${darkMode ? 'text-white' : 'text-emerald-950'}`}>VoxDo</span>
            <div className={`hidden sm:block text-[9px] uppercase tracking-widest font-bold border-l pl-4 ${darkMode ? 'border-[#1f3a2c] text-[#00ff41]' : 'border-emerald-200 text-emerald-700'}`}>
              Zero-Touch<br/>Workspace
            </div>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-md transition-colors cursor-pointer ${darkMode ? 'text-[#00ff41] hover:bg-[#1f3a2c]' : 'text-emerald-700 hover:bg-emerald-100'}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         {/* Main content grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[70vh]">
            
            {/* Left side */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 flex items-center justify-center border ${darkMode ? 'border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]' : 'border-emerald-600 bg-emerald-50 text-emerald-600'}`}>
                  <Mic size={24} />
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-emerald-950'}`}>VoxDo</h1>
                  <p className={`text-[10px] uppercase tracking-widest font-bold ${darkMode ? 'text-[#00ff41]' : 'text-emerald-700'}`}>Study & Project Assistant</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className={`text-3xl font-black uppercase tracking-wider ${darkMode ? 'text-white' : 'text-emerald-950'}`}>Welcome Student</h2>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sign in with your Google account to turn your spoken voice notes into clean study summaries, assignment checklists, and presentation decks.
                </p>
              </div>

              {/* MAIN GOOGLE SIGN IN BUTTON */}
              <button 
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className={`w-full sm:w-4/5 py-4 text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg ${
                  darkMode 
                    ? 'border border-[#00ff41] bg-[#00ff41] hover:bg-emerald-400 text-black shadow-[#00ff41]/20' 
                    : 'border border-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <span className="font-sans font-black text-lg">G</span> SIGN IN WITH GOOGLE
              </button>

              <div className="space-y-3 pt-6 border-t border-dashed border-[#1f3a2c]">
                <div className={`text-[10px] uppercase font-bold tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Connected Directly With:</div>
                <div className={`flex gap-4 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className={darkMode ? 'text-[#00ff41]' : 'text-emerald-600'}/> Google Docs</span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className={darkMode ? 'text-[#00ff41]' : 'text-emerald-600'}/> Google Sheets</span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className={darkMode ? 'text-[#00ff41]' : 'text-emerald-600'}/> Google Slides</span>
                </div>
              </div>
            </div>

            {/* Right side styling */}
            <div className={`border p-8 sm:p-12 relative overflow-hidden ${darkMode ? 'border-[#1f3a2c] bg-[#0a0f0d]/80' : 'border-emerald-200 bg-white/90'}`}>
               <div className="space-y-8 relative z-10">
                 <div className="space-y-2">
                   <h3 className={`text-[10px] uppercase tracking-widest font-bold ${darkMode ? 'text-[#00ff41]' : 'text-emerald-600'}`}>How it helps you</h3>
                   <h2 className={`text-xl font-bold uppercase ${darkMode ? 'text-white' : 'text-emerald-950'}`}>Never manually type study notes again</h2>
                 </div>
                 <div className="space-y-6">
                    <div className="flex gap-3">
                      <CheckCircle2 size={16} className={`mt-0.5 ${darkMode ? 'text-[#00ff41]' : 'text-emerald-600'}`} />
                      <div>
                        <h4 className={`text-[10px] uppercase font-bold mb-1 ${darkMode ? 'text-white' : 'text-emerald-900'}`}>Talk out your ideas</h4>
                        <p className={`text-xs font-sans ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Record post-lecture thoughts or brainstorm group projects freely without staring at a blank page.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 size={16} className={`mt-0.5 ${darkMode ? 'text-[#00ff41]' : 'text-emerald-600'}`} />
                      <div>
                        <h4 className={`text-[10px] uppercase font-bold mb-1 ${darkMode ? 'text-white' : 'text-emerald-900'}`}>Auto-organized tasks</h4>
                        <p className={`text-xs font-sans ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Due dates, exam reminders, and homework items are extracted straight into your task board.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 size={16} className={`mt-0.5 ${darkMode ? 'text-[#00ff41]' : 'text-emerald-600'}`} />
                      <div>
                        <h4 className={`text-[10px] uppercase font-bold mb-1 ${darkMode ? 'text-white' : 'text-emerald-900'}`}>Instant Workspace Files</h4>
                        <p className={`text-xs font-sans ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create organized spreadsheets, study notes, and ready-to-use slides with zero manual formatting.</p>
                      </div>
                    </div>
                 </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}