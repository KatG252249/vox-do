'use client';

import React, { useState } from 'react';
import { Mic, CheckCircle2, Moon, Sun } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { FileText, Table, Presentation, ClipboardList, Calendar } from 'lucide-react';

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
              Study and Project Assistant<br/>
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
                  <p className={`text-[10px] uppercase tracking-widest font-bold ${darkMode ? 'text-[#00ff41]' : 'text-emerald-700'}`}>Voice-activated project management and study tracking.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className={`text-3xl font-black uppercase tracking-wider ${darkMode ? 'text-white' : 'text-emerald-950'}`}>Welcome, Student...</h2>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sign in with your Google account to turn your spoken voice notes into study summaries, assignment checklists, and ready-to-edit Docs, Sheets, and Slides so you can start from a framework instead of a blank page.  
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
                {/* Official Google SVG Logo */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                SIGN IN WITH GOOGLE
              </button>

              <div className="space-y-6 pt-6 border-t border-dashed border-[#1f3a2c]">
                <div className={`text-[10px] text-center uppercase font-bold tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Connected Directly With:
                </div>
                
                <div className="flex justify-center gap-6 sm:gap-8 flex-wrap">
                  
                  <div className={`flex flex-col items-center gap-2 hover:scale-110 transition-transform ${darkMode ? 'text-[#00ff41]' : 'text-emerald-700'}`}>
                    <FileText size={22} className="opacity-90" />
                    <span className="text-[9px] tracking-widest font-bold">DOCS</span>
                  </div>

                  <div className={`flex flex-col items-center gap-2 hover:scale-110 transition-transform ${darkMode ? 'text-[#00ff41]' : 'text-emerald-700'}`}>
                    <Table size={22} className="opacity-90" />
                    <span className="text-[9px] tracking-widest font-bold">SHEETS</span>
                  </div>

                  <div className={`flex flex-col items-center gap-2 hover:scale-110 transition-transform ${darkMode ? 'text-[#00ff41]' : 'text-emerald-700'}`}>
                    <Presentation size={22} className="opacity-90" />
                    <span className="text-[9px] tracking-widest font-bold">SLIDES</span>
                  </div>

                  <div className={`flex flex-col items-center gap-2 hover:scale-110 transition-transform ${darkMode ? 'text-[#00ff41]' : 'text-emerald-700'}`}>
                    <ClipboardList size={22} className="opacity-90" />
                    <span className="text-[9px] tracking-widest font-bold">FORMS</span>
                  </div>

                  <div className={`flex flex-col items-center gap-2 hover:scale-110 transition-transform ${darkMode ? 'text-[#00ff41]' : 'text-emerald-700'}`}>
                    <Calendar size={22} className="opacity-90" />
                    <span className="text-[9px] tracking-widest font-bold">CALENDAR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side styling */}
            <div className={`border p-8 sm:p-12 relative overflow-hidden ${darkMode ? 'border-[#1f3a2c] bg-[#0a0f0d]/80' : 'border-emerald-200 bg-white/90'}`}>
               <div className="space-y-8 relative z-10">
                 <div className="space-y-2">
                   <h3 className={`text-[10px] uppercase tracking-widest font-bold ${darkMode ? 'text-[#00ff41]' : 'text-emerald-600'}`}>How VoxDo helps you</h3>
                   <h2 className={`text-xl font-bold uppercase ${darkMode ? 'text-white' : 'text-emerald-950'}`}>Stop staring at a blank page.</h2>
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
                        <h4 className={`text-[10px] uppercase font-bold mb-1 ${darkMode ? 'text-white' : 'text-emerald-900'}`}>Ready-to-Edit Workspace Files</h4>
                        <p className={`text-xs font-sans ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Generates the framework for spreadsheets, docs, and slides with headers and structure already in place - you fill in the details.</p>
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