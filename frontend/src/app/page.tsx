"use client";

import { useState } from "react";
import AudioRecorder from "@/components/AudioRecorder";
import { BookOpen, CheckSquare, Presentation, Calendar, Award, ExternalLink } from "lucide-react";

export default function Home() {
  const [pipelineData, setPipelineData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            Google Global Hackathon 2026
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            VoxDo
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Autonomous Voice Journal & Zero-Touch Google Workspace Agent.
          </p>
        </header>

        {/* Audio Recorder Module */}
        <AudioRecorder
          onProcessingComplete={setPipelineData}
          setIsProcessing={setIsProcessing}
          isProcessing={isProcessing}
        />

        {/* Live Execution Deliverables Feed */}
        {pipelineData && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-2">
              Executed Actions ({pipelineData.total_actions})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pipelineData.actions?.map((actionItem: any, index: number) => {
                const { tool, result } = actionItem;

                if (tool === "log_journal_entry") {
                  return (
                    <div key={index} className="col-span-full p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-indigo-400">
                          <BookOpen className="w-5 h-5" />
                          <span className="font-semibold text-sm">Personal Journal Log</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Tone: {result.sentiment}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{result.summary}</p>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {result.tags?.map((tag: string, i: number) => (
                          <span key={i} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (tool === "create_task_item") {
                  return (
                    <div key={index} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <CheckSquare className="w-5 h-5" />
                        <span className="font-semibold text-sm">Task Added</span>
                      </div>
                      <p className="font-medium text-slate-200">{result.title}</p>
                      <div className="text-xs text-slate-400 flex justify-between">
                        <span>Course: {result.subject}</span>
                        <span className="text-amber-400">Due: {result.due_date}</span>
                      </div>
                    </div>
                  );
                }

                if (tool === "generate_presentation_draft") {
                  return (
                    <div key={index} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center space-x-2 text-sky-400">
                        <Presentation className="w-5 h-5" />
                        <span className="font-semibold text-sm">Slide Deck Created</span>
                      </div>
                      <p className="font-medium text-slate-200">{result.topic}</p>
                      <p className="text-xs text-slate-400">{result.slides_count} slides structured</p>
                      <a
                        href={result.download_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-xs text-sky-400 hover:text-sky-300 font-medium mt-1"
                      >
                        <span>Download .pptx deck</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                }

                if (tool === "schedule_calendar_event") {
                  return (
                    <div key={index} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center space-x-2 text-rose-400">
                        <Calendar className="w-5 h-5" />
                        <span className="font-semibold text-sm">Calendar Event</span>
                      </div>
                      <p className="font-medium text-slate-200">{result.event_title}</p>
                      <p className="text-xs text-slate-400">Time: {result.start_time}</p>
                    </div>
                  );
                }

                if (tool === "record_win_or_milestone") {
                  return (
                    <div key={index} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center space-x-2 text-yellow-400">
                        <Award className="w-5 h-5" />
                        <span className="font-semibold text-sm">Milestone Achieved</span>
                      </div>
                      <p className="font-medium text-slate-200">{result.title}</p>
                      <p className="text-xs text-slate-400">{result.impact}</p>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}