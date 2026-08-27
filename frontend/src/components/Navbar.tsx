'use client';

import React from 'react';
import { ViewType } from '@/app/page';
import { Search, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export default function Navbar({ darkMode, setDarkMode, setCurrentView }: NavbarProps) {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className={`w-full border-b py-3 px-4 sm:px-6 sticky top-0 z-30 transition-colors ${
      darkMode ? 'bg-[#060907]/95 border-[#1f3a2c] backdrop-blur' : 'bg-[#f7fbf8]/95 border-emerald-200 backdrop-blur'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand + Tagline */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="text-xl sm:text-2xl font-bold tracking-wider cursor-pointer flex items-center gap-2"
          >
            <span className={darkMode ? 'text-white' : 'text-emerald-950'}>VoxDo</span>
          </button>
          <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider pl-3 border-l ${
            darkMode ? 'border-[#1f3a2c] text-[#00ff41]' : 'border-emerald-300 text-emerald-700'
          }`}>
            Study and Project Assistant 
          </span>
        </div>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-3">
          <div className={`hidden md:flex items-center px-2.5 py-1.5 border text-xs ${
            darkMode ? 'border-[#1f3a2c] bg-[#0a0f0d] text-gray-400' : 'border-emerald-200 bg-white text-gray-700'
          }`}>
            <Search size={13} className="mr-2 text-gray-400" />
            <input 
              type="text" 
              placeholder="SEARCH WORKSPACE..." 
              className="bg-transparent border-none outline-none text-xs w-36 lg:w-48 font-mono uppercase text-inherit"
            />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 border transition-colors cursor-pointer ${
                darkMode ? 'border-[#1f3a2c] text-[#00ff41] hover:bg-[#0a0f0d]' : 'border-emerald-200 text-emerald-800 hover:bg-emerald-100/60'
              }`}
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            {/* User Profile Avatar */}
            {session?.user?.image ? (
              <img 
                src={session.user.image} 
                alt="User Profile" 
                className="w-8 h-8 rounded-full border border-[#2e2e2e] hover:border-[#00ff9d] transition-colors cursor-pointer object-cover"
                title={session.user.email || "Profile"} 
              />
            ) : (
              <div 
                className="w-8 h-8 rounded-full bg-[#1e1e1e] border border-[#2e2e2e] flex items-center justify-center text-[#00ff9d] text-sm font-bold uppercase cursor-pointer"
                title={session?.user?.email || "Profile"}
              >
                {session?.user?.email?.charAt(0) || "U"}
              </div>
            )}

            {/* Log Out Button */}
            <button 
              onClick={() => router.push('/login')}
              className={`px-3 py-1.5 border text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                darkMode 
                  ? 'border-[#1f3a2c] text-gray-300 hover:border-red-500 hover:text-red-400 hover:bg-[#0a0f0d]' 
                  : 'border-emerald-200 text-gray-700 bg-white hover:border-red-500 hover:text-red-600 shadow-sm'
              }`}
              title="Log Out"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}