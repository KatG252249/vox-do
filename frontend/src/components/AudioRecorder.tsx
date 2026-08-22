"use client";

import React, { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

interface AudioRecorderProps {
  onProcessingComplete: (data: any) => void;
  setIsProcessing: (loading: boolean) => void;
  isProcessing: boolean;
}

export default function AudioRecorder({
  onProcessingComplete,
  setIsProcessing,
  isProcessing,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await sendAudioToBackend(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordDuration(0);
      timerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const sendAudioToBackend = async (blob: Blob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("audio", blob, "voice_input.webm");
    formData.append("user_time_context", new Date().toLocaleString());

    try {
      const response = await fetch("http://127.0.0.1:8000/api/process-voice", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      onProcessingComplete(data);
    } catch (error) {
      console.error("Failed to process audio:", error);
      alert("Error processing audio on backend.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="mb-4">
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="flex items-center justify-center w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 transition-all animate-pulse"
          >
            <Square className="w-8 h-8" />
          </button>
        ) : isProcessing ? (
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-600/50 text-white cursor-not-allowed">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <button
            onClick={startRecording}
            className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
          >
            <Mic className="w-8 h-8" />
          </button>
        )}
      </div>

      <p className="text-sm font-medium text-slate-300">
        {isRecording
          ? `Recording... (${formatTime(recordDuration)})`
          : isProcessing
          ? "Agent analyzing intent & executing tools..."
          : "Tap mic to dump thoughts"}
      </p>
    </div>
  );
}