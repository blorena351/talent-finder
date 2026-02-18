/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, useEffect } from 'react';
import { Job, Store } from '../services/store';
import { analyzeVideoAnswer, evaluateTranscript, generateQuestions, transcribeAnswer } from '../services/gemini';
import { StopIcon, PlayIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface InterviewProps {
  job: Job;
  applicantName: string;
  onComplete: (
    transcripts: {question: string, answer: string, score: number}[],
    videoAnalyses: { question: string; summary: string; confidence: number }[],
    videos: Record<number, Blob>
  ) => void;
  onCancel: () => void;
}

export const Interview: React.FC<InterviewProps> = ({ job, applicantName, onComplete, onCancel }) => {
  const [step, setStep] = useState<'intro' | 'loading_questions' | 'question' | 'uploading' | 'finished'>('intro');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60s per answer
  const [results, setResults] = useState<{question: string, answer: string, score: number}[]>([]);
  const [videoAnalysisResults, setVideoAnalysisResults] = useState<{ question: string; summary: string; confidence: number }[]>([]);
  const [videoBlobs, setVideoBlobs] = useState<Record<number, Blob>>({});
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
             throw new Error("MediaDevices API not supported");
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Camera access failed or not available:", err);
        setIsSimulationMode(true);
      }
    };
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStart = async () => {
    setStep('loading_questions');
    if (isSimulationMode) {
         // Simulate loading delay
         await new Promise(r => setTimeout(r, 1500));
         setQuestions([
             "Can you describe a challenging project you worked on?",
             "How do you handle tight deadlines?",
             "What is your experience with the required technologies?"
         ]);
    } else {
        const jobAISettings = Store.getJobAISettings(job.id);
        const qs = await generateQuestions(job.title, job.requirements, {
          tone: jobAISettings.tone,
          priorityQuestions: jobAISettings.priorityQuestions,
        });
        setQuestions(qs);
    }
    setStep('question');
  };

  const startRecording = () => {
    if (isSimulationMode) {
        setIsRecording(true);
        return;
    }

    if (!streamRef.current) return;
    
    chunksRef.current = [];
    // Prefer VP8 for compatibility, fallback to standard
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8') 
      ? 'video/webm;codecs=vp8' 
      : 'video/webm';
      
    try {
        const recorder = new MediaRecorder(streamRef.current, {
          mimeType,
          videoBitsPerSecond: 450_000,
          audioBitsPerSecond: 64_000,
        });
        
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        
        recorder.onstop = async () => {
          setStep('uploading');
          const blob = new Blob(chunksRef.current, { type: mimeType });
          
          // Save blob for this question
          setVideoBlobs(prev => ({ ...prev, [currentQuestionIndex]: blob }));
    
          // Transcript is the source for scoring/profile analytics.
          const currentQ = questions[currentQuestionIndex];
          const transcriptResult = await transcribeAnswer(blob, currentQ);
          const transcriptEvaluation = await evaluateTranscript(currentQ, transcriptResult.transcript);
          const videoAnalysis = await analyzeVideoAnswer(blob, currentQ);
          
          const newResult = {
            question: currentQ,
            answer: transcriptResult.transcript,
            score: transcriptEvaluation.quality
          };
          const newVideoAnalysis = {
            question: currentQ,
            summary: videoAnalysis.summary,
            confidence: videoAnalysis.confidence,
          };
          
          setResults(prev => [...prev, newResult]);
          setVideoAnalysisResults(prev => [...prev, newVideoAnalysis]);
          
          // Next step
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setTimeLeft(60);
            setStep('question');
          } else {
            setStep('finished');
            onComplete(
              [...results, newResult],
              [...videoAnalysisResults, newVideoAnalysis],
              { ...videoBlobs, [currentQuestionIndex]: blob }
            );
          }
        };
    
        recorder.start();
        setIsRecording(true);
        mediaRecorderRef.current = recorder;
    } catch (e) {
        console.error("Failed to start MediaRecorder", e);
        setIsSimulationMode(true);
        setIsRecording(true);
    }
  };

  const stopRecording = async () => {
    if (isSimulationMode) {
        setIsRecording(false);
        setStep('uploading');
        
        // Simulate uploading/processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const currentQ = questions[currentQuestionIndex];
        const mockResult = {
            question: currentQ,
            answer: "This is a simulated response generated because camera access was unavailable. In a real interview, the candidate's spoken response would be transcribed here.",
            score: Math.floor(Math.random() * 20) + 70 // Random score between 70-90
        };
        const mockVideoAnalysis = {
            question: currentQ,
            summary: "Simulation mode: video behavior analysis not available without camera capture.",
            confidence: 40
        };
        
        setResults(prev => [...prev, mockResult]);
        setVideoAnalysisResults(prev => [...prev, mockVideoAnalysis]);
        
        // Create a dummy blob
        const mockBlob = new Blob(['Simulation Data'], { type: 'text/plain' });
        setVideoBlobs(prev => ({ ...prev, [currentQuestionIndex]: mockBlob }));

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setTimeLeft(60);
            setStep('question');
        } else {
            setStep('finished');
            onComplete(
              [...results, mockResult],
              [...videoAnalysisResults, mockVideoAnalysis],
              { ...videoBlobs, [currentQuestionIndex]: mockBlob }
            );
        }
        return;
    }

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Timer
  useEffect(() => {
    let interval: any;
    if (isRecording && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRecording) {
      stopRecording();
    }
    return () => clearInterval(interval);
  }, [isRecording, timeLeft]);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center p-4">
      {/* Main Interview Container */}
      <div className="relative w-full max-w-5xl h-[85vh] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col md:flex-row">
        
        {/* Left Side: Video & Controls */}
        <div className="relative flex-1 bg-black flex flex-col">
          {/* Camera Feed or Simulation Placeholder */}
          {isSimulationMode ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500 p-8 text-center border-b border-zinc-800 md:border-b-0">
                  <div className={`p-6 rounded-full bg-zinc-800 mb-6 ${isRecording ? 'animate-pulse ring-2 ring-red-500/50' : ''}`}>
                      <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Simulation Mode Active</h3>
                  <p className="max-w-md mx-auto">Camera access was not detected. The interview is running in demonstration mode with simulated AI responses.</p>
                  {isRecording && (
                      <p className="text-red-400 mt-4 font-mono animate-pulse">Recording Simulated Answer...</p>
                  )}
              </div>
          ) : (
            <video 
                ref={videoRef} 
                autoPlay 
                muted 
                className={`w-full h-full object-cover ${step === 'uploading' ? 'opacity-50 blur-sm' : ''}`}
            />
          )}
          
          {/* Overlay UI */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
             <div className="flex justify-between items-start">
                <div className="bg-red-500/90 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg transition-opacity duration-300" style={{ opacity: isRecording ? 1 : 0 }}>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    REC {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="bg-zinc-900/80 backdrop-blur text-zinc-300 px-3 py-1 rounded-full text-xs border border-zinc-700">
                    {applicantName}
                </div>
             </div>
             
             {/* Question Overlay */}
             {step === 'question' && (
                 <div className="bg-zinc-900/95 backdrop-blur-md p-6 rounded-xl border border-zinc-700 shadow-2xl mb-12 max-w-2xl mx-auto text-center transform transition-all duration-500 animate-in slide-in-from-bottom-4">
                    <h3 className="text-zinc-400 text-xs font-mono uppercase tracking-widest mb-2">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </h3>
                    <p className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                        {questions[currentQuestionIndex]}
                    </p>
                 </div>
             )}
          </div>

          {/* Controls Bar */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center pointer-events-auto gap-6 z-10">
             {step === 'intro' && (
               <button onClick={handleStart} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2">
                  <PlayIcon className="w-6 h-6" /> Start Interview
               </button>
             )}
             
             {step === 'question' && !isRecording && (
                <button onClick={startRecording} className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-red-500/20 transition-all flex items-center gap-3">
                   <div className="w-4 h-4 rounded-full border-2 border-white"></div>
                   Start Answer
                </button>
             )}

             {isRecording && (
                <button onClick={stopRecording} className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-full font-bold text-lg border border-zinc-600 shadow-lg transition-all flex items-center gap-3">
                   <StopIcon className="w-6 h-6 text-red-500" />
                   Finish Answer
                </button>
             )}
          </div>

          {/* Processing Overlay */}
          {(step === 'loading_questions' || step === 'uploading' || step === 'finished') && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-8 backdrop-blur-sm z-20">
                {step === 'finished' ? (
                   <div className="flex flex-col items-center animate-in zoom-in duration-300">
                      <CheckCircleIcon className="w-20 h-20 text-green-500 mb-4" />
                      <h2 className="text-3xl font-bold text-white mb-2">Interview Complete!</h2>
                      <p className="text-zinc-400">Finalizing your profile...</p>
                   </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                        <h3 className="text-xl font-mono text-blue-400 mb-2">
                            {step === 'loading_questions' ? 'AI Agent Generating Questions...' : 'Analyzing Response...'}
                        </h3>
                        <p className="text-zinc-500 text-sm max-w-md">
                            {step === 'loading_questions' 
                                ? "Analyzing job requirements to create a custom interview script."
                                : "Transcribing audio and evaluating soft skills integration."
                            }
                        </p>
                    </div>
                )}
            </div>
          )}
        </div>

        {/* Right Side: Sidebar info (Desktop only) */}
        <div className="hidden md:flex w-80 bg-zinc-950 border-l border-zinc-800 flex-col p-6">
            <div className="mb-8">
                <h2 className="text-zinc-100 font-bold text-lg mb-1">{job.title}</h2>
                <p className="text-zinc-500 text-sm">{job.companyId}</p>
                {isSimulationMode && (
                    <span className="inline-block mt-2 text-[10px] uppercase font-bold bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/20">
                        Demo / Simulation Mode
                    </span>
                )}
            </div>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <h3 className="text-xs font-mono uppercase text-zinc-600">Progress</h3>
                    <div className="flex gap-2">
                        {/* We use currentQuestionIndex + 1 as total if questions is empty during loading, else questions.length */}
                        {Array.from({ length: Math.max(3, questions.length) }).map((_, i) => (
                            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${
                                i < currentQuestionIndex ? 'bg-green-500' : 
                                i === currentQuestionIndex ? 'bg-blue-500 animate-pulse' : 'bg-zinc-800'
                            }`}></div>
                        ))}
                    </div>
                </div>

                <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                   <h3 className="text-xs font-mono uppercase text-zinc-500 mb-3">Tips</h3>
                   <ul className="text-sm text-zinc-400 space-y-2 list-disc pl-4">
                      <li>Speak clearly and look at the camera.</li>
                      <li>Use specific examples (STAR method).</li>
                      <li>You have 60 seconds per question.</li>
                   </ul>
                </div>
            </div>
            
            <button onClick={onCancel} className="mt-auto text-zinc-600 hover:text-white text-sm py-2">
                Cancel Interview
            </button>
        </div>
      </div>
    </div>
  );
};
