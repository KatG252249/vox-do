'use client';

import React, { useState, useRef } from 'react';
import { Mic, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { ViewType, Task, JournalEntry, ArtifactItem } from '@/app/page';
import { useSession} from 'next-auth/react';
import { useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; 


interface DashboardViewProps {
  onNavigate: (v: ViewType) => void;
  darkMode: boolean;
  tasks: Task[];
  journalEntries: JournalEntry[];
  artifacts: ArtifactItem[];
  onNewProcessedData: (data: { journal?: any; tasks?: Task[]; artifact?: any }) => void;
}

export default function DashboardView({ 
  onNavigate, 
  darkMode, 
  tasks, 
  journalEntries, 
  artifacts, 
  onNewProcessedData 
}: DashboardViewProps) {
  const {data: session} = useSession();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  console.log("DashboardView component is rendering! Session is:", session);

  useEffect(() => {

    console.log("Checking session before DB fetch:", session); 

    const fetchUserData = async () => {
      if (!session?.user?.email) {
        console.log("Aborting fetch: No user email found."); 
        return; 
      }

      try {
        console.log("Fetching data for:", session.user.email);
        const email = session.user.email;
        
        // 1. Fetch Tasks
        const qTasks = query(collection(db, "tasks"), where("userEmail", "==", email));
        const snapTasks = await getDocs(qTasks);
        const fetchedTasks = snapTasks.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 2. Fetch Artifacts
        const qArtifacts = query(collection(db, "artifacts"), where("userEmail", "==", email));
        const snapArtifacts = await getDocs(qArtifacts);
        const fetchedArtifacts = snapArtifacts.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 3. Fetch Journals
        const qJournals = query(collection(db, "journals"), where("userEmail", "==", email));
        const snapJournals = await getDocs(qJournals);
        const fetchedJournals = snapJournals.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 3. Send the array to your UI!
        onNewProcessedData({ 
            tasks: fetchedTasks as any,
            artifact: fetchedArtifacts as any,
            journal: fetchedJournals as any 
        });
          console.log("Successfully loaded tasks into the UI!");
        

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [session]);
    
  const playCompletionChime = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    // Two-tone rising chime
    osc.frequency.setValueAtTime(698.46, audioCtx.currentTime);
    osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.45);
  } catch (e) {
    console.error('Audio cue error:', e);
  }
};

  // Start / Stop Live Audio Capture
  const handleToggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach(track => track.stop()); // Release mic
          await sendAudioToBackend(audioBlob);
        };

        recorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access error:", err);
        alert("Microphone access denied or unavailable.");
      }
    }
  };

 const sendAudioToBackend = async (audioBlob: Blob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', audioBlob, 'voxdo-recording.webm');

    const handleStopRecording = async (audioBlob: Blob) => {
      setIsRecording(false);

      console.log("Current NextAuth Session:", session);

      const formData = new FormData();
      formData.append("file", audioBlob, "voxdo-recording.webm");

    }
    if (session && (session as any).accessToken){
      console.log("Attaching Access Token to FormData!");
      formData.append('access_token', (session as any).accessToken);
    } else {
      console.warn("No access token found in session!");
    }

    if (session?.user?.email) {
      console.log("Attaching user email for Firestore!");
      formData.append('userEmail', session.user.email);
    } else {
      console.warn("No user email found in session!");
    }

    try {
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/process-audio', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || result.status !== 'success') {
        throw new Error(result.detail || result.error || `Server error (${response.status})`);
      }

      if (result.data) {
        onNewProcessedData(result.data);

        playCompletionChime();
      }
    } catch (error: any) {
      console.error("Error communicating with backend:", error);
      alert(`Backend Error: ${error.message || 'Failed to process audio.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'QUEUE' || t.status === 'PROCESSING');
  const topTask = pendingTasks.find(t => t.priority === 'HIGH') || pendingTasks[0];
  const latestJournal = journalEntries[0];
  const latestArtifact = artifacts[0];

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
            onClick={handleToggleRecording}
            disabled={isProcessing}
            className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer active:scale-95 ${
              isProcessing
                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                : isRecording 
                  ? 'bg-[#00ff41] border-[#00ff41] text-black shadow-lg shadow-[#00ff41]/40' 
                  : darkMode 
                    ? 'bg-transparent border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black' 
                    : 'bg-emerald-50 border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white'
            }`}
          >
            {isProcessing ? (
              <Loader2 size={26} className="animate-spin" />
            ) : (
              <Mic size={26} className="sm:w-8 sm:h-8" />
            )}
          </button>
        </div>

        <h2 className={`text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-1 text-center ${
          darkMode ? 'text-white' : 'text-emerald-950'
        }`}>
          {isProcessing 
            ? 'GEMINI SYNTHESIZING AUDIO...' 
            : isRecording 
              ? 'RECORDING LIVE AUDIO... (CLICK TO FINISH)' 
              : 'VOICE STREAM READY'}
        </h2>
        <p className={`text-[11px] font-sans text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {isProcessing
            ? 'Structuring tasks, journal entries, and workspace files'
            : isRecording 
              ? 'Speak assignments, lecture notes, or project tasks freely' 
              : 'Tap mic to initiate audio capture'}
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
            {latestJournal ? (
              <div className="space-y-2">
                <div className={`border-l-2 pl-2.5 py-1 ${darkMode ? 'border-[#00ff41]' : 'border-emerald-600 bg-emerald-50/50'}`}>
                  <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{latestJournal.date}</span>
                  <p className={`text-xs font-sans line-clamp-2 mt-0.5 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    {latestJournal.title} — {latestJournal.summary}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">No journal logs yet.</p>
            )}
          </div>
          <button className={cardBtnStyle}>
            View Full Archive
          </button>
        </div>

        {/* 2. Active Tasks */}
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
            
            {latestArtifact ? (
              <div className={`p-2.5 border flex justify-between items-center ${
                darkMode ? 'border-[#1f3a2c] bg-[#0d1411]' : 'border-emerald-200 bg-emerald-50/60'
              }`}>
                <div>
                  <div className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-900'} truncate max-w-[180px]`}>
                    {latestArtifact.name}
                  </div>
                  <div className={`text-[10px] uppercase font-bold ${darkMode ? 'text-[#00ff41]' : 'text-emerald-700'}`}>
                    Google {latestArtifact.type}
                  </div>
                </div>
                <CheckCircle2 size={15} className={darkMode ? 'text-[#00ff41]' : 'text-emerald-600'} />
              </div>
            ) : (
              <p className="text-xs text-gray-500">No artifacts generated yet.</p>
            )}
          </div>
          <button className={cardBtnStyle}>
            Access Database
          </button>
        </div>

      </div>
    </div>
  );
}